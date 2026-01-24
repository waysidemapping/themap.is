import { generateStyle } from './styleGenerator.js'; 
import { beefsteakProtocolFunction } from "https://cdn.jsdelivr.net/gh/waysidemapping/beefsteak-map-tiles/demo/src/beefsteak-protocol.js";
let map;

let baseStyleJsonString;
let presetsById;
let activeStyleInfo;

window.addEventListener('load', function() {
  initializeMap();
});

async function initializeMap() {

  baseStyleJsonString = await fetch('/style/basestyle.json').then(response => response.text());
  presetsById = await fetch('/dist/presets.json').then(response => response.json());

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

  const beefsteakEndpoint = JSON.parse(baseStyleJsonString).sources.beefsteak.url;
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

  reloadMapStyle();
}

export const themes = {
  "books": {
    name: "books",
    features: [
      {
        preset: "amenity/library"
      },
      {
        preset: "amenity/public_bookcase",
        class: "minor"
      },
      {
        preset: "shop/books"
      }
    ]
  },
  "bicycle_rental": {
    name: "bicycle rental",
    features: [
      {
        preset: "amenity/bicycle_rental"
      }
    ]
  },
  "swimming_pools": {
    name: "swimming pools",
    features: [
      {
        preset: "leisure/sports_centre/swimming"
      },
      {
        preset: "leisure/swimming_pool",
        class: "minor"
      }
    ]
  }
};

async function reloadMapStyle() {

  if (!baseStyleJsonString || !presetsById) return;

  let theme = themes["swimming_pools"];

  let styleInfo = await generateStyle(baseStyleJsonString, presetsById, theme);

  // We can put any absolute URL here since we override it in the transformRequest
  styleInfo.style.sprite = window.location.origin;

  if (activeStyleInfo && activeStyleInfo.spritesheets) {
    URL.revokeObjectURL(styleInfo.spritesheets["1"].pngUrl);
    URL.revokeObjectURL(styleInfo.spritesheets["1"].jsonUrl);
    URL.revokeObjectURL(styleInfo.spritesheets["2"].pngUrl);
    URL.revokeObjectURL(styleInfo.spritesheets["2"].jsonUrl);
  }
  activeStyleInfo = styleInfo;

  map.setStyle(styleInfo.style, {
    diff: true,
    validate: true
  });
}
