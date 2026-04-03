import { colors } from "../colors.js";
import { filters } from "../filters.js";
import { lineLayerLineWidthExpression } from "../lineWidthExpression.js";

export function getLayer() {
  return {
    "id": "line",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "line",
    "filter": [
      "any",
      filters.is_ferry,
      filters.is_railway,
      filters.is_powerline,
      filters.is_aerialway,
      filters.is_aeroway,
      [
        "all",
        filters.is_highway,
        [
          "any",
          [">=", ["zoom"], 12],
          ["in", "road", ["split", ["coalesce", ["get", "r.route"], ""], "┃"]]
        ]
      ],
      filters.is_watercourse,
      filters.is_barrier
    ],
    "layout": {
      "line-join": "round",
      "line-cap": "butt",
      "line-sort-key": [
        "case",
        filters.is_aerialway, 60,
        filters.is_powerline, 50,
        filters.is_barrier, 40,
        filters.is_railway, 30,
        filters.is_ferry, 20,
        ["in", ["get", "highway"], ["literal", ["motorway", "trunk"]]], 5,
        ["in", ["get", "highway"], ["literal", ["motorway_link", "trunk_link"]]], -5,
        filters.is_watercourse, -10,
        0
      ]
    },
    "paint": {
      "line-width": lineLayerLineWidthExpression,
      "line-color": [
        "step", ["zoom"], [
          "case",
          filters.is_aerialway, colors.aerialway_stroke,
          filters.is_ferry, colors.ferry_stroke,
          filters.is_railway, colors.railway_stroke,
          filters.is_powerline, colors.powerline_stroke,
          filters.is_floating_boom, colors.floating_boom_stroke,
          filters.is_barrier, colors.barrier_stroke,
          filters.is_watercourse, [
            "case",
            filters.has_tunnel, colors.watercourse_tunnel_stroke,
            colors.watercourse_stroke,
          ],
          ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], colors.highway_major_stroke,
          colors.highway_minor_stroke
        ],
        14,  [
          "case",
          filters.is_aerialway, colors.aerialway_stroke,
          filters.is_ferry, colors.ferry_stroke,
          filters.is_railway, colors.railway_stroke,
          filters.is_powerline, colors.powerline_stroke,
          filters.is_floating_boom, colors.floating_boom_stroke,
          filters.is_barrier, colors.barrier_stroke,
          filters.is_watercourse, [
            "case",
            filters.has_tunnel, colors.watercourse_tunnel_stroke,
            colors.watercourse_stroke,
          ],
          ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], colors.highway_major_high_zoom_stroke,
          filters.has_tunnel, colors.highway_minor_high_zoom_tunnel_stroke,
          colors.highway_minor_high_zoom_stroke
        ]
      ],
      "line-opacity": [
        "case",
        ["all", ["any", filters.is_highway, filters.is_aeroway, filters.is_watercourse, filters.is_railway], filters.has_tunnel], 0.4,
        ["all", filters.is_powerline, filters.has_subsurface_location], 0.6,
        1
      ],
      "line-dasharray": [
        "case",
        filters.is_ferry, ["literal", [4, 4]],
        filters.has_intermittence, ["literal", [2, 2]],
        ["literal", [1]]
      ]
    }
  };
}