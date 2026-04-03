import { getStructures } from "../structures.js";

export function getLayer(opts) {
  const structures = getStructures(opts);
  return {
    "id": "structure_fill",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "fill",
    "filter": [
      "any",
      ...structures.filter(info => info.fill_color).map(info => info.filter)
    ],
    "layout": {
      "fill-sort-key": [
        "case",
        ...structures.filter(info => info.fill_color).map((info, i) => [info.filter, i]).flat(),
        0
      ]
    },
    "paint": {
      "fill-opacity": [
        "case",
        ...structures.filter(info => info.fill_color && info.fill_opacity).toReversed().map(info => [info.filter, info.fill_opacity]).flat(),
        [">", ["to-number", ["get", "layer"], "0"], 0], 0.6,
        1
      ],
      "fill-color": [
        "case",
        ...structures.filter(info => info.fill_color).toReversed().map(info => [info.filter, info.fill_color]).flat(),
        "red"
      ]
    }
  };
}