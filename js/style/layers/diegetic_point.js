import { colors } from "../colors.js";
import { filters } from "../filters.js";

export function getLayer() {
  return {
    "id": "diegetic_point",
    "source": "beefsteak",
    "source-layer": "point",
    "type": "circle",
    "filter": [
      "any",
      filters.is_minor_power_support,
      filters.is_major_power_support,
      filters.is_aerialway_support,
      [
        "all",
        filters.is_tree,
        [">=", ["zoom"], 15]
      ]
    ],
    "paint": {
      "circle-radius": [
        "interpolate", ["exponential", 2], ["zoom"],
        15, [
          "case",
          filters.is_tree, 1.5,
          filters.is_minor_power_support, 1.3,
          1.75
        ],
        22, [
          "case",
          filters.is_tree, 192,
          filters.is_minor_power_support, 12,
          16
        ]
      ],
      "circle-opacity": [
        "interpolate", ["linear"], ["zoom"],
        15, [
          "case",
          filters.is_tree, 0.2,
          1
        ],
        22, [
          "case",
          filters.is_tree, 0.075,
          1
        ],
      ],
      "circle-color": [
        "case",
        filters.is_tree, colors.tree,
        filters.is_major_power_support, colors.powerline_stroke,
        filters.is_minor_power_support, colors.powerline_stroke,
        filters.is_aerialway_support, colors.aerialway_stroke,
        "red"
      ]
    },
    "minzoom": 12
  };
}