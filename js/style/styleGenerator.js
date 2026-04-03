import * as layers from "./layers/index.js";
import { getSpritesheets } from './spritesheetGenerator.js';

export async function generateStyle(baseStyleJson, opts) {
  // parse anew every time to avoid object references
  const style = JSON.parse(JSON.stringify(baseStyleJson));

  if (opts.render3d) {
    style.terrain = {
      "source": "mapterhorn",
      "exaggeration": 1
    };
  }

  let sprites = [];

  function pushLayer(layer) {
    style.layers.push(layer);
  }

  function getLayer(getter) {
    const layerInfo = getter(opts);
    if (layerInfo?.sprites) {
      sprites = sprites.concat(layerInfo.sprites);
    }
    return layerInfo?.layer || layerInfo;
  }

  function addLayer(getter) {
    const layer = getLayer(getter);
    if (layer) {
      pushLayer(layer);
    }
  }

  addLayer(layers.background);

  addLayer(layers.landuse_fill);
  addLayer(layers.landuse_inset);
  addLayer(layers.coastline);
  addLayer(layers.surface_landuse_outline);
  addLayer(layers.landuse_outline);
  
  addLayer(layers.hillshade);

  const structureFillLayer = getLayer(layers.structure_fill);
  const structureOutlineLayer = getLayer(layers.structure_outline);
  const lineCasingLayer = getLayer(layers.line_casing);
  const lineLayer = getLayer(layers.line);
  const lineOverlayLayer = getLayer(layers.line_overlay);
  const diegeticPointLayer = getLayer(layers.diegetic_point); 

  for (const tagLayer of ["-3","-2","-1","0","1","2","3"]) {
    pushLayer(forTagLayer(structureFillLayer, tagLayer));
    pushLayer(forTagLayer(structureOutlineLayer, tagLayer));
    pushLayer(forTagLayer(lineCasingLayer, tagLayer));
    pushLayer(forTagLayer(lineLayer, tagLayer));
    pushLayer(forTagLayer(lineOverlayLayer, tagLayer));
    pushLayer(forTagLayer(diegeticPointLayer, tagLayer));
  }

  addLayer(layers.building_extrusion);

  addLayer(layers.boundary_casing);
  addLayer(layers.boundary);

  addLayer(layers.theme_line);

  addLayer(layers.line_label);
  addLayer(layers.point_label);

  let spritesheets = await getSpritesheets(sprites);

  return {
    style: style,
    spritesheets: spritesheets
  };
}

function forTagLayer(layer, tagLayer) {
  let newLayer = Object.assign({}, layer);
  newLayer.id += '_' + tagLayer;
  let layerFilter;
  if (tagLayer === '0') {
    layerFilter = [
      "any",
      ["!", ["has", "layer"]],
      ["==", ["get", "layer"], "0"]
    ];
  } else if (tagLayer === '-3') {
    layerFilter = ["<=", ["to-number", ["get", "layer"], "0"], -2];
  } else if (tagLayer === '3') {
    layerFilter = [">=", ["to-number", ["get", "layer"], "0"], 2];
  } else {
    layerFilter = ["==", ["get", "layer"], tagLayer];
  }
  newLayer.filter = [
    "all",
    layerFilter,
    newLayer.filter
  ];
  return newLayer;
}