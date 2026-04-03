import { getStructures } from "../structures.js";

export function getLayer(opts) {
  const structures = getStructures(opts);
  return {
    "id": "structure-outline",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "line",
    "filter": [
      "any",
      ...structures.filter(info => info.outline_color).map(info => info.filter)
    ],
    "layout": {
      "line-sort-key": [
        "case",
        ...structures.filter(info => info.outline_color).map((info, i) => [info.filter, i]).flat(),
        0
      ]
    },
    "paint": {
      "line-opacity": [
        "case",
        [">", ["to-number", ["get", "layer"], "0"], 0], 0.75,
        1
      ],
      "line-width": 0.5,
      "line-color": [
        "case",
        ...structures.filter(info => info.outline_color).toReversed().map(info => [info.filter, info.outline_color]).flat(),
        "red"
      ]
    }
  };
}