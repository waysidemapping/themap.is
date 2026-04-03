import { colors } from "../colors.js";

export function getLayer(opts) {
  if (!opts.render3d) return;
  return {
    "id": "hillshade",
    "type": "hillshade",
    "source": "mapterhorn",
    "paint": {
      "hillshade-method": "igor",
      "hillshade-shadow-color": colors.hillshade_shadow
    },
    "minzoom": 12
  };
}