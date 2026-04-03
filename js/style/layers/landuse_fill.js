import { landuses } from "../landuses.js";

export function getLayer() {
  return {
    "id": "landuse_fill",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "fill",
    "filter": [
      "any",
      ...landuses.filter(info => info.fill_color).map(info => {
        if (info.high_zoom) return info.filter;
        return [
          "all",
          ["<", ["zoom"], 12],
          info.filter
        ];
      })
    ],
    "layout": {
      "fill-sort-key": [
        "case",
        ...landuses.filter(info => info.fill_color).map((info, i) => [info.filter, i]).flat(),
        0
      ]
    },
    "paint": {
      "fill-color": [
        "step", ["zoom"], [
          "case",
          ...landuses.filter(info => info.fill_color).toReversed().map(info => [info.filter, info.fill_color]).flat(),
          "red"
        ],
        // Use step function to avoid incorrect coloring due to double tagging (e.g. landuse=industrial + power=plant)
        12, [
          "case",
          ...landuses.filter(info => info.fill_color && info.high_zoom).toReversed().map(info => [info.filter, info.fill_color]).flat(),
          "red"
        ]
      ]
    }
  };
}