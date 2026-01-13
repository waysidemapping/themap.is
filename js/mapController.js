import { generateStyle } from './styleGenerator.js'; 
import { beefsteakProtocolFunction } from "https://cdn.jsdelivr.net/gh/waysidemapping/beefsteak-map-tiles/demo/src/beefsteak-protocol.js";
let map;

let baseStyleJsonString;

let cachedStyles = {};

window.addEventListener('load', function() {
  initializeMap();
});

async function initializeMap() {

  baseStyleJsonString = await fetch('/style/basestyle.json').then(response => response.text());

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

function reloadMapStyle() {

  if (!baseStyleJsonString) return;

  let styleId = "onestylefornow";
  if (!cachedStyles[styleId]) cachedStyles[styleId] = JSON.stringify(generateStyle(baseStyleJsonString));
  
  // always parse from string to avoid stale referenced objects
  let style = JSON.parse(cachedStyles[styleId]);

  // MapLibre requires an absolute URL for `sprite`
  style.sprite = window.location.origin + style.sprite;

  map.setStyle(style, {
    diff: true,
    validate: true,
  });
}
