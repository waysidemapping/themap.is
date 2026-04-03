import { colors } from "../colors.js";

export function getLayer() {
  return {
    "id": "boundary_casing",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "line",
    "filter": [
      "all",
      ["has", "r.boundary"],
      ["has", "r.admin_level"],
      ["in", "administrative", ["split", ["get", "r.boundary"], "┃"]],
      [
        "any",
        ["in", "2", ["split", ["get", "r.admin_level"], "┃"]],
        ["in", "4", ["split", ["get", "r.admin_level"], "┃"]],
        ["in", "6", ["split", ["get", "r.admin_level"], "┃"]],
        ["in", "8", ["split", ["get", "r.admin_level"], "┃"]]
      ],
      ["!", ["==", ["get", "maritime"], "yes"]]
    ],
    "paint": {
      "line-color": colors.admin_boundary_casing,
      "line-opacity": 0.5,
      "line-width": [
        "case",
        [
          "any",
          ["in", "6", ["split", ["get", "r.admin_level"], "┃"]],
          ["in", "8", ["split", ["get", "r.admin_level"], "┃"]]
        ], 2,
        ["in", "4", ["split", ["get", "r.admin_level"], "┃"]], 2.5,
        3
      ]
    }
  };
}