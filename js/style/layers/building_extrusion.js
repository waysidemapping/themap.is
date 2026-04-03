import { colors } from "../colors.js";
import { filters } from "../filters.js";

export function getLayer(opts) {
  if (!opts.render3d) return;

  return {
    "id": "building_extrusion",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "fill-extrusion",
    "filter": [
      "step", ["zoom"], filters.is_building,
      16, [
        "any",
        [
          "all",
          filters.is_building,
          [
            "!",
            [
              "all",
              ["has", "building:parts"],
              ["!", ["==", ["get", "building:parts"], "no"]]
            ]
          ]
        ],
        filters.is_building_part
      ]
    ],
    "paint": {
      "fill-extrusion-color": colors.building_fill,
      "fill-extrusion-opacity": 0.4,
      "fill-extrusion-height": [
        "coalesce",
        [
          "case",
          ["has", "height"], [
            "case",
            // explicit meters
            ["in", " m", ["get", "height"]], ["to-number", ["slice", ["get", "height"], 0, ["-", ["length", ["get", "height"]], 2]]],
            // feet
            ["in", " ft", ["get", "height"]], ["*", ["to-number", ["slice", ["get", "height"], 0, ["-", ["length", ["get", "height"]], 3]]], 1/0.3048],
            // also feet
            ["in", "'", ["get", "height"]], ["*", ["to-number", ["slice", ["get", "height"], 0, ["-", ["length", ["get", "height"]], 1]]], 1/0.3048],
            // implicit meters
            ["to-number", ["get", "height"]]
          ],
          3.5
        ],
        ["*", ["to-number", ["get", "building:levels"], 1], 3.5],
      ],
      "fill-extrusion-base": [
        "case",
        ["has", "min_height"], [
          "case",
          // explicit meters
          ["in", " m", ["get", "min_height"]], ["to-number", ["slice", ["get", "min_height"], 0, ["-", ["length", ["get", "min_height"]], 2]]],
          // feet
          ["in", " ft", ["get", "min_height"]], ["*", ["to-number", ["slice", ["get", "min_height"], 0, ["-", ["length", ["get", "min_height"]], 3]]], 1/0.3048],
          // also feet
          ["in", "'", ["get", "min_height"]], ["*", ["to-number", ["slice", ["get", "min_height"], 0, ["-", ["length", ["get", "min_height"]], 1]]], 1/0.3048],
          // implicit meters
          ["to-number", ["get", "min_height"]]
        ],
        0
      ]
    }
  };
}