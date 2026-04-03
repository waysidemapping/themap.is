import { colors } from "../colors.js";
import { filters } from "../filters.js";

export function getLayer() {
  return {
    "id": "coastline",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "line",
    "filter": filters.is_coastline,
    "layout": {
      "line-join": "round"
    },
    "paint": {
      "line-color": colors.water_outline,
      "line-width": 0.5
    }
  };
}