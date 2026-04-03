import { colors } from "../colors.js";
import { filters } from "../filters.js";

export function getLayer() {
  return {
    "id": "line_overlay",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "line",
    "filter": [
      "any",
      filters.is_foot_route,
      filters.is_floating_boom
    ],
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-width": [
        "interpolate", ["exponential", 2], ["zoom"],
        12, [
          "case",
          filters.is_floating_boom, 2,
          filters.is_foot_route, 1,
          1
        ],
        18, [
          "case",
          filters.is_floating_boom, 9,
          filters.is_foot_route, 1,
          1
        ],
      ],
      "line-color": [
        "case",
        filters.is_floating_boom, colors.floating_boom_stroke,
        filters.is_foot_route, colors.route_foot_overlay,
        "red"
      ],
      "line-dasharray": [
        "case",
        filters.is_floating_boom, ["literal", [0.6, 3]],
        filters.is_foot_route, ["literal", [2.625, 2.375]],
        ["literal", [1]],
      ]
    }
  };
}