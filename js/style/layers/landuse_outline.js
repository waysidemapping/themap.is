import { landuses } from "../landuses.js";

export function getLayer() {
  return {
    "id": "landuse_outline",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "line",
    "filter": [
      "any",
      ...landuses.filter(info => info.outline_color && !info.high_zoom).map(info => info.filter)
    ],
    "layout": {
      "line-sort-key": [
        "case",
        ...landuses.filter(info => info.outline_color && !info.high_zoom).map((info, i) => [info.filter, i]).flat(),
        0
      ]
    },
    "paint": {
      "line-color": [
        "case",
        ...landuses.filter(info => info.outline_color && !info.high_zoom).toReversed().map(info => [info.filter, info.outline_color]).flat(),
        "red"
      ],
      "line-width": 0.5
    }
  };
}