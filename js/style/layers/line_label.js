import { colors } from "../colors.js";
import { filters } from "../filters.js";
import { localizedNameExpressions } from "../localizedTag.js";
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
  
  return {
    "id": "line_label",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "symbol",
    "filter": [
      "any",
      filters.is_aerialway,
      filters.is_aeroway,
      filters.is_barrier,
      filters.is_ferry,
      filters.is_highway,
      filters.is_powerline,
      filters.is_railway,
      filters.is_watercourse
    ],
    "layout": {
      "symbol-placement": "line",
      "symbol-sort-key": [
        "case",
        // Prioritize the focused features (value related to symbol-sort-key for the point-label layer)
        anyThemeLineFeatureExp, -1.6e15,
        0
      ],
      "text-size": 10.5,
      "text-font": [
          "case",
          filters.is_watercourse, ["literal", ["Noto Serif Italic"]],
          ["literal", ["Noto Sans Regular"]]
      ],
      "text-field": localizedNameExpressions(opts).localizedName
    },
    "paint": {
      "text-color": [
        "case",
        filters.is_aerialway, colors.aerialway_text,
        filters.is_powerline, colors.power_text,
        filters.is_watercourse, colors.water_text,
        colors.text
      ],
      "text-halo-color": colors.text_halo,
      "text-halo-width": 1
    }
  };
}