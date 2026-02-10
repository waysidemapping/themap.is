import { generateStyle } from './styleGenerator.js'; 
import { state } from "./stateController.js";
import { ExtrusionControl } from './ui/ExtrusionControl.js';
import { beefsteakProtocolFunction } from "https://cdn.jsdelivr.net/gh/waysidemapping/beefsteak-map-tiles/demo/src/beefsteak-protocol.js";

let map;
let activeStyleInfo;

let cachedFeatureKeyValueMaps = {
  point: null,
  line: null
};

const baseStyleJson = {
  "version": 8,
  "name": "themap.is basemap style",
  "glyphs": "https://tiles.openstreetmap.us/fonts/{fontstack}/{range}.pbf",
  "sources": {
    "beefsteak": {
      "type": "vector",
      "url": "https://tiles.waysidemapping.org/beefsteak"
    },
    "mapterhorn": {
      "type": "raster-dem",
      "tiles": ["https://tiles.mapterhorn.com/{z}/{x}/{y}.webp"],
      "attribution": `<a href="https://mapterhorn.com/" target="_blank">Mapterhorn</a>`,
      "encoding": "terrarium",
      "tileSize": 512,
    }
  },
  "layers": []
};

initializeMap();

function initializeMap() {

  // default
  let initialCenter = [-75, 42];
  let initialZoom = 5;

  // show last-open area if any (this is overriden by the URL hash map parameter)
  let cachedTransformString = localStorage?.getItem('map_transform');
  let cachedTransform = cachedTransformString && JSON.parse(cachedTransformString);
  if (cachedTransform && cachedTransform.zoom && cachedTransform.lat && cachedTransform.lng) {
    initialZoom = cachedTransform.zoom;
    initialCenter = cachedTransform;
  }

  map = new maplibregl.Map({
    container: 'map',
    hash: "map",
    center: initialCenter,
    zoom: initialZoom,
    fadeDuration: 0,
  });
  if (map.getPitch() > 0) {
    // if there is a default pitch set in the URL, enable 3D
    state.set('render3d', true);
  }

  const beefsteakEndpoint = baseStyleJson.sources.beefsteak.url;
  const beefsteakEndpointPrefix = /(.*\/\/.*\/)/.exec(beefsteakEndpoint)[1];
  maplibregl.addProtocol('beefsteak', beefsteakProtocolFunction);
    map.setTransformRequest((url, resourceType) => {
    if (url.startsWith(beefsteakEndpointPrefix) && resourceType === 'Tile') {
        return { url: 'beefsteak://' + url };
    }
    if (activeStyleInfo && activeStyleInfo.spritesheets) {
      if (resourceType === 'SpriteJSON') {
        return { url: url.includes('@2x') ? activeStyleInfo.spritesheets["2"].jsonUrl : activeStyleInfo.spritesheets["1"].jsonUrl };
      }
      if (resourceType === 'SpriteImage') {
        return { url: url.includes('@2x') ? activeStyleInfo.spritesheets["2"].pngUrl : activeStyleInfo.spritesheets["1"].pngUrl };
      }
    }
    return undefined;
  });

  // Add zoom and rotation controls to the map.
  map
    .addControl(new maplibregl.NavigationControl({
      visualizePitch: true
    }))
    .addControl(new ExtrusionControl())
    .addControl(new maplibregl.GeolocateControl({
      fitBoundsOptions: {
        animate: false
      },
      positionOptions: {
          enableHighAccuracy: true
      },
      trackUserLocation: true
    }))
    .addControl(new maplibregl.ScaleControl({
        maxWidth: 150,
        unit: 'imperial'
    }), "bottom-left");
  
  map.on('moveend', mapTransformChanged);
  map.on('resize', mapTransformChanged);
  map.on('sourcedata', e => {
    if (e.sourceId === 'beefsteak' && e.isSourceLoaded) {
      cachedFeatureKeyValueMaps = {
        point: null,
        line: null
      };
    }
  });
  mapTransformChanged();

  state.addEventListener('change-theme', reloadMapStyle);
  state.addEventListener('change-render3d', _ => {
    setMaxPitch();
    reloadMapStyle();
  });
  setMaxPitch();
  reloadMapStyle();
}
function setMaxPitch() {
  const desiredMaxPitch = state.render3d ? 60 : 0;
  if (map.getMaxPitch() !== desiredMaxPitch) {
    map.setMaxPitch(desiredMaxPitch);
    if (desiredMaxPitch > 0 && map.getPitch() === 0) {
      map.setPitch(30);
    }
  }
}

function mapTransformChanged() {
  cachedFeatureKeyValueMaps = {
    point: null,
    line: null
  };

  state.set({
    mapTransform: {
      zoom: map.getZoom(),
      center:  map.getCenter().toArray(),
      bearing: map.getBearing(),
      pitch: map.getPitch(),
      bounds: map.getBounds().toArray()
    }
  });
}

async function reloadMapStyle() {

  if (!map) return;

  const userLangs = navigator.languages ? navigator.languages : navigator.language ? [navigator.language] : [];

  let styleInfo = await generateStyle(baseStyleJson, {
    theme: state.theme,
    langs: userLangs,
    render3d: state.render3d
  });

  // We can put any absolute URL here since we override it in the transformRequest,
  // but it has to be unique to the style since MapLibre will cache it
  styleInfo.style.sprite = window.location.origin + '/' + (state.theme?.id || 'default');

  if (activeStyleInfo && activeStyleInfo.spritesheets) {
    URL.revokeObjectURL(activeStyleInfo.spritesheets["1"].pngUrl);
    URL.revokeObjectURL(activeStyleInfo.spritesheets["1"].jsonUrl);
    URL.revokeObjectURL(activeStyleInfo.spritesheets["2"].pngUrl);
    URL.revokeObjectURL(activeStyleInfo.spritesheets["2"].jsonUrl);
  }
  activeStyleInfo = styleInfo;

  map.setStyle(styleInfo.style, {
    diff: true,
    validate: true
  });
}

function pointFeaturesByKeyValue() {
  if (cachedFeatureKeyValueMaps.point) return cachedFeatureKeyValueMaps.point;
  if (!map?.isStyleLoaded()) return {};

  const { width, height } = map.getCanvas()
    // use this to account for pixel ratio
    .getBoundingClientRect();

  function isVisible(feature) {
    const point = map.project(feature.geometry.coordinates);
    return point.x >= 0 &&
      point.y >= 0 &&
      point.x <= width &&
      point.y <= height
  }

  // Query all features (not just rendered) in the visible tiles for the current zoom level
  let features = map.querySourceFeatures('beefsteak', {
    sourceLayer: "point"
  // Just because a feature is in the visible tile doesn't mean it's actually in the visible part of the tile, so we need an additional check
  }).filter(isVisible);
 
  cachedFeatureKeyValueMaps.point = keyValueMapForFeatures(features);
  return cachedFeatureKeyValueMaps.point;
}

function lineFeaturesByKeyValue() {
  if (cachedFeatureKeyValueMaps.line) return cachedFeatureKeyValueMaps.line;
  if (!map?.isStyleLoaded()) return {};

  // Query all features (not just rendered) in the visible tiles for the current zoom level
  let features = map.querySourceFeatures('beefsteak', {
    sourceLayer: "line"
  });
 
  cachedFeatureKeyValueMaps.line = keyValueMapForFeatures(features);
  return cachedFeatureKeyValueMaps.line;
}

function keyValueMapForFeatures(features) {
  const featuresByKeyValue = {};
  for (let i in features) {
    let feature = features[i];
    let featureId = feature.id;
    for (let key in feature.properties) {
      let rawValue = feature.properties[key];
      if (typeof rawValue === 'string') {
        let values = rawValue.split('┃').filter(Boolean).map(value => value.split(';')).flat();
        for (let j in values) {
          let kv = key + '=' +  values[j];
          if (!featuresByKeyValue[kv]) {
            featuresByKeyValue[kv] = new Set([featureId]);
          } else {
            featuresByKeyValue[kv].add(featureId);
          }
        }
      }
      let kv = key + '=*';
      if (!featuresByKeyValue[kv]) {
        featuresByKeyValue[kv] = new Set([featureId]);
      } else {
        featuresByKeyValue[kv].add(featureId);
      }
    }
  }
  return featuresByKeyValue;
}

export function hasSourceFeaturesForTheme(theme) {
  function anyFeatureMatchesTheme(featuresByKeyValue) {
    for (let i in theme.features) {
      let matchingFeatures;
      let keyPrefix = (theme.features[i].geometry && theme.features[i].geometry.includes('relation')) ? 'r.' : '';
      let tags = theme.features[i].tags;
      for (let key in tags) {
        let kv = keyPrefix + key + '=' + tags[key];
        let features = featuresByKeyValue[kv] || new Set();
        if (!matchingFeatures) {
          matchingFeatures = features;
        } else {
          matchingFeatures = matchingFeatures.intersection(features);
        }
        if (matchingFeatures.size === 0) break;
      }
      if (matchingFeatures && matchingFeatures.size > 0) return true;
    }
    return false;
  }

  if (anyFeatureMatchesTheme(lineFeaturesByKeyValue())) return true;
  if (anyFeatureMatchesTheme(pointFeaturesByKeyValue())) return true;
  return false;
}