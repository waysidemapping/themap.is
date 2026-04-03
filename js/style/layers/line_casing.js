import { colors } from "../colors.js";
import { filters } from "../filters.js";
import { lineLayerLineWidthExpression } from "../lineWidthExpression.js";

export function getLayer() {
  return {
    "id": "line_casing",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "line",
    "filter": [
      "any",
      ["all", ["<", ["zoom"], 12], filters.is_powerline, ["!", filters.has_subsurface_location]],
      filters.is_railway,
      ["all", [">=", ["zoom"], 14], filters.is_aeroway],
      ["all", [">=", ["zoom"], 14], filters.is_highway],
      ["all", filters.is_watercourse, ["any", filters.has_tunnel, filters.has_bridge]]
    ],
    "layout": {
      "line-join": "round",
      "line-cap": "butt"
    },
    "paint": {
      "line-opacity": [
        "case",
        ["all", ["any", filters.is_highway, filters.is_aeroway, filters.is_watercourse], filters.has_tunnel], 0.7,
        ["all", filters.is_railway, filters.has_tunnel], 0.4,
        filters.is_railway, 1,
        filters.has_bridge, 0.4,
        1
      ],
      "line-width": [
        "interpolate", ["linear"], ["zoom"],
        14, [
          "case",
          filters.is_powerline, 0.75,
          filters.is_railway, 1.15,
          filters.has_bridge, 2,
          1
        ],
        18, [
          "case",
          filters.is_powerline, 0.75,
          filters.is_railway, 2,
          filters.has_bridge, 7,
          1
        ]
      ],
      "line-color": [
        "case",
        filters.is_powerline, colors.powerline_stroke,
        filters.is_railway, colors.railway_stroke,
        colors.highway_casing
      ],
      "line-gap-width": lineLayerLineWidthExpression,
      "line-dasharray": [
        "case",
        filters.is_powerline, ["literal", [1.85, 25]],
        filters.is_railway, ["literal", [0.25, 4]],
        ["!", filters.has_paving], ["literal", [3, 2]],
        ["all", ["any", filters.is_highway, filters.is_aeroway, filters.is_watercourse], filters.has_tunnel], ["literal", [8, 4]],
        ["literal", [1]]
      ]
    }
  };
}