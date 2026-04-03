import { landuses } from "../landuses.js";

export function getLayer() {
  return {
    "id": "landuse_inset",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "line",
    "filter": [
      "any",
      ...landuses.filter(info => info.fill_color && !info.high_zoom).map(info => info.filter)
    ],
    "layout": {
      "line-join": "round",
      "line-sort-key": [
        "case",
        ...landuses.filter(info => info.fill_color && !info.high_zoom).map((info, i) => [info.filter, i]).flat(),
        0
      ]
    },
    "paint": {
      "line-opacity": 0.7,
      "line-color": [
        "case",
        ...landuses.filter(info => info.fill_color && !info.high_zoom).toReversed().map(info => [info.filter, info.fill_color]).flat(),
        "red"
      ],
      "line-width": 3.6,
      "line-offset": 1.8
    },
    "minzoom": 12
  };
}