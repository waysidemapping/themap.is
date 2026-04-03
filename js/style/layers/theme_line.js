import { colors } from "../colors.js";
import { expressionForFeature } from "../expressions.js";

export function getLayer(opts) {

  const themeLineFeatures = opts.theme ? opts.theme.features.filter(feature => {
    if (!feature.geometry) return true;
    return feature.geometry.includes('relation') || feature.geometry.includes('line')
  }).map(item => {
    let feature = Object.assign({}, item);
    feature.exp = expressionForFeature(feature);
    return feature;
  }) : [];
  const anyThemeLineFeatureExp = themeLineFeatures.length ? ["any", ...themeLineFeatures.map(feature => feature.exp)] : false;
  
  if (!themeLineFeatures.length) return;

  return {
    "id": "theme_line",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "line",
    "filter": anyThemeLineFeatureExp,
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": colors.theme_line_color,
      "line-width": 1
    }
  };
}