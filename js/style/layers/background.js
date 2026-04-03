import { colors } from "../colors.js";

export function getLayer() {
  return {
    "id": "background",
    "type": "background",
    "paint": {
        "background-color": colors.background
    }
  };
}