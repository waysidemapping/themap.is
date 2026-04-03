import { colors } from "../colors.js";

export function getLayer() {
  return {
    "id": "boundary",
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
      "line-color": colors.admin_boundary_stroke,
      "line-width": [
        "case",
        ["in", "2", ["split", ["get", "r.admin_level"], "┃"]], 1.75,
        ["in", "4", ["split", ["get", "r.admin_level"], "┃"]], 1.5,
        1
      ],
      "line-dasharray": [
        "case",
        ["in", "2", ["split", ["get", "r.admin_level"], "┃"]], ["literal", [10, 1, 2, 1]],
        ["in", "4", ["split", ["get", "r.admin_level"], "┃"]], ["literal", [6, 1, 2, 1, 2, 1]],
        ["literal", [6, 3, 3, 3]]
      ]
    }
  };
}