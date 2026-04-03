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

  const nameInfo = localizedNameExpressions(opts);

  const displaysWaterbodyNameFilter = [
    "all",
    filters.is_flowline,
    ["!", nameInfo.hasLocalizedName],
    ["any", ...nameInfo.osmLangSuffixes.map(suffix => 'waterbody:name' + suffix).map(key => ["has", key])]
  ];

  return {
    "id": "line_label",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "symbol",
    "filter": [
      "any",
      [
        "all",
        nameInfo.hasLocalizedName,
        [
          "any",
          filters.is_aerialway,
          filters.is_aeroway,
          filters.is_barrier,
          filters.is_ferry,
          filters.is_highway,
          filters.is_powerline,
          filters.is_railway,
          filters.is_waterway_network_edge
        ]
      ],
      displaysWaterbodyNameFilter
    ],
    "layout": {
      "symbol-placement": "line",
      "text-letter-spacing": [
        "case",
        displaysWaterbodyNameFilter, 2.5,
        0
      ],
      "text-transform": [
        "case",
        displaysWaterbodyNameFilter, "uppercase",
        "none"
      ],
      "symbol-sort-key": [
        "case",
        // Prioritize the focused features (value related to symbol-sort-key for the point-label layer)
        anyThemeLineFeatureExp, -1.6e15,
        0
      ],
      "text-size": [
        "case",
        displaysWaterbodyNameFilter, 11,
        10.5
      ],
      "text-font": [
          "case",
          filters.is_waterway_network_edge, ["literal", ["Noto Serif Italic"]],
          ["literal", ["Noto Sans Regular"]]
      ],
      "text-field": [
        "case",
        filters.is_flowline, ["coalesce", ...nameInfo.osmNameKeys.concat(nameInfo.osmLangSuffixes.map(suffix => 'waterbody:name' + suffix)).map(key => ["get", key])],
        nameInfo.localizedName
      ]
    },
    "paint": {
      "text-color": [
        "case",
        filters.is_aerialway, colors.aerialway_text,
        filters.is_powerline, colors.power_text,
        filters.is_waterway_network_edge, colors.water_text,
        colors.text
      ],
      "text-halo-color": colors.text_halo,
      "text-halo-width": 1
    }
  };
}