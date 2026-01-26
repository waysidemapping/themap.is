import { generateStyle } from './styleGenerator.js'; 
import { state } from "./stateController.js";
import { beefsteakProtocolFunction } from "https://cdn.jsdelivr.net/gh/waysidemapping/beefsteak-map-tiles/demo/src/beefsteak-protocol.js";

let map;
let activeStyleInfo;

const baseStyleJson = {
    "version": 8,
    "name": "The Map Is Basemap Style",
    "glyphs": "https://tiles.openstreetmap.us/fonts/{fontstack}/{range}.pbf",
    "sources": {
       "beefsteak": {
            "type": "vector",
            "url": "http://159.69.74.234/beefsteak"
        }
    },
    "layers": []
};

initializeMap();

function initializeMap() {

  // default
  let initialCenter = [-111.545, 39.546];
  let initialZoom = 6;

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
    .addControl(new maplibregl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }))
    .addControl(new maplibregl.ScaleControl({
        maxWidth: 150,
        unit: 'imperial'
    }), "bottom-left");

  state.addEventListener('change-theme', function() {
    reloadMapStyle();
  });
  reloadMapStyle();
}

async function reloadMapStyle() {

  if (!map) return;

  let styleInfo = await generateStyle(baseStyleJson, state.theme);

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
