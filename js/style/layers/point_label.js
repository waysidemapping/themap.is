import { colors } from "../colors.js";
import { filters } from "../filters.js";
import { landuses } from "../landuses.js";

import { localizedNameExpressions } from "../localizedTag.js";
import { expressionForFeature, getAccessExp } from "../expressions.js";

import { registerSvg } from '../../svgManager.js';
import { getStructures } from "../structures.js";

export function getLayer(opts) {

  const structures = getStructures(opts);

  const theme = opts.theme;
  const themePointFeatures = theme ? theme.features.filter(feature => {
    if (!feature.geometry) return true;
    return feature.geometry.includes('vertex') || feature.geometry.includes('point') || feature.geometry.includes('area') || feature.geometry.includes('relation');
  }).map(item => {
    let feature = Object.assign({}, item);
    feature.exp = expressionForFeature(feature);
    return feature;
  }) : [];
  const anyThemePointFeatureExp = themePointFeatures.length ? ["any", ...themePointFeatures.map(feature => feature.exp)] : false;

  const nameInfo = localizedNameExpressions(opts);

  let icons = {};
  function iconExp(opts) {
    if (!opts.file) opts = Object.assign({file: 'dot'}, opts);
    let id = registerSvg(opts);
    icons[id] = true;
    return ["image", id];
  }

  const eleSublabels = [
    {
      selector: filters.has_elevation,
      label:  ["concat", [
        "number-format",
        ["/", ["to-number", ['get', 'ele'], "0"], 0.3048],
        { "max-fraction-digits": 0.1 }
      ], " ft"],
    }
  ];

  const highZoomPointLabels = [
    {
      caseSelector: filters.is_waterfall,
      selector: nameInfo.hasLocalizedName,
      label: nameInfo.localizedName,
      sublabels: [
        {
          selector: ["has", "height"],
          label:  ["concat", [
            "number-format",
            ["/", ["to-number", ['get', 'height'], "0"], 0.3048],
            { "max-fraction-digits": 0.1 }
          ], " ft ↕︎"],
        }
      ]
    },
    {
      caseSelector: [
        "any",
        filters.is_peak,
        filters.is_survey_point
      ],
      selector: nameInfo.hasLocalizedName,
      label: nameInfo.localizedName,
      sublabels: eleSublabels
    },
    {
      selector: nameInfo.hasLocalizedName,
      label: nameInfo.localizedName
    }
  ];

  const lowZoomPointLabels = [
    {
      caseSelector: [
        "all",
        filters.is_peak,
        // if the map is peaks then we want to show the actual peak name
        ["!", anyThemePointFeatureExp]
      ],
      selector: ["any", ...nameInfo.osmLangSuffixes.map(suffix => 'massif:name' + suffix).concat(nameInfo.osmNameKeys).map(key => ["has", key])],
      label: ["coalesce", ...nameInfo.osmLangSuffixes.map(suffix => 'massif:name' + suffix).concat(nameInfo.osmNameKeys).map(key => ["get", key])],
      sublabels: eleSublabels
    }
  ].concat(highZoomPointLabels);
  
  const layer = {
    "id": "point_label",
    "source": "beefsteak",
    "source-layer": "point",
    "type": "symbol",
    "filter": [
      "any",
      [
        "all",
        [
          "any",
          [
            "all",
            ["in", ["get", "admin_level"], ["literal", ["2", "4", "5", "8"]]],
            ["in", ["get", "boundary"], ["literal", ["administrative"]]]
          ],
          ["in", ["get", "place"], ["literal", ["city", "village", "town", "hamlet"]]]
        ],
        [
          "any",
          ["in", ["get", "admin_level"], ["literal", ["2", "4"]]],
          ["in", ["get", "capital"], ["literal", ["2", "4"]]],
          [
            "all",
            [">=", ["zoom"], 5],
            [">=", ["to-number", ["get", "population"], "0"], 100000]
          ],
          [
            "all",
            [">=", ["zoom"], 8],
            [">=", ["to-number", ["get", "population"], "0"], 50000]
          ],
          [">=", ["zoom"], 10],
          [">=", ["to-number", ["get", "population"], "0"], 1000000]
        ]
      ],
      [
        "all",
        ["<=", ["zoom"], 3],
        filters.is_continent
      ],
      [
        "all",
        // Only label area landuse and structures here
        ["in", ["get", "osm.type"], ["literal", ["w", "r"]]],
        [
          "any",
          ...structures.filter(info => info.text_color).map(info => info.filter),
          ...landuses.filter(info => info.text_color).map(info => info.filter),
        ]
      ],
      filters.is_landform_area_poi,
      filters.is_water_area_poi,
      [
        "all",
        filters.is_peak,
        filters.has_elevation,
        [
          "any",
          [
            "all",
            ["has", "prominence"],
            [">=", ["to-number", ["get", "prominence"], "0"], 100]
          ],
          ["in", ["get", "highest_point"], ["literal", ["1", "2", "3", "4"]]],
          [">=", ["zoom"], 12],
        ]
      ],
      [
        "all",
        filters.is_survey_point,
        [
          "any",
          ["in", ["get", "highest_point"], ["literal", ["1", "2", "3", "4"]]],
          [">=", ["zoom"], 12]
        ]
      ],
      filters.is_waterfall,
      anyThemePointFeatureExp
    ],
    "layout": {
      "symbol-placement": "point",
      "text-optional": true,
      "symbol-sort-key": [
        "case",
        anyThemePointFeatureExp,
          // Prioritize the focused features by making sure the sort value is always
          // lower than that of the largest possible Web Mercator feature
          ["-", -1.6e15, ["coalesce", ["get", "c.area"], 0]],
        ["-", ["coalesce", ["get", "c.area"], 0]]
      ],
      "icon-image": themePointFeatures.filter(feature => feature.iconInfo).length ? [
        "case",
        ...themePointFeatures.filter(feature => feature.iconInfo).map(feature => {

          if (feature.showOnlyAccess === "allowed") {
            return [feature.exp, iconExp(feature.iconInfo)];
          }
          if (feature.showOnlyAccess === "disallowed") {
            return [feature.exp, iconExp(noAccessIcon)];
          }

          const accessInfo = feature.access || [{
            keys: ['access'],
            allowedByDefault: true
          }];

          return [feature.exp, [
            "case",
            getAccessExp(accessInfo), iconExp(feature.iconInfo),
            iconExp(feature.disallowedAccessIconInfo)
          ]];
        }).flat(),
        filters.is_waterfall, iconExp({
          file: "waterfall",
          fill: colors.water_minor_icon,
          halo: colors.text_halo
        }),
        filters.is_peak, iconExp({
          file: "triangle_up",
          fill: colors.peak
        }),
        filters.is_survey_point, iconExp({
          file: "plus_squat",
          fill: colors.text
        }),
        ["image", ""]
      ] : ["image", ""],
      "icon-size": [
        "interpolate", ["linear"], ["zoom"],
        12, [
          "case",
          anyThemePointFeatureExp, 1,
          ["any", filters.is_survey_point, filters.is_peak], 0.5,
          1
        ],
        22, 1
      ],
      "text-variable-anchor-offset": themePointFeatures.filter(feature => feature.iconInfo).length ? [
        "case",
        ...themePointFeatures.filter(feature => feature.iconInfo && feature.iconInfo?.fill).map(feature => {
          return [feature.exp, ["literal", ["left", [1.1, 0], "right", [-1.1, 0]]]]
        }).flat(),
        ...themePointFeatures.filter(feature => feature.iconInfo && !feature.iconInfo?.fill).map(feature => {
          return [feature.exp, ["literal", ["left", [0.8, 0], "right", [-0.8, 0]]]]
        }).flat(),
        ["any", filters.is_waterfall], ["literal", ["left", [0.8, 0], "right", [-0.8, 0]]],
        ["any", filters.is_survey_point, filters.is_peak], ["literal", ["left", [0.5, 0], "right", [-0.5, 0]]],
        ["literal", ["center", [0, 0]]]
      ] : ["literal", ["center", [0, 0]]],
      "text-size": [
        "case",
        anyThemePointFeatureExp, 10.5,
        [
          "any",
          filters.is_continent,
          filters.is_ice,
          filters.is_landform_area_poi,
          filters.is_water_area_poi
        ], 10,
        10.5
      ],
      "text-transform":[
        "case",
        anyThemePointFeatureExp, "none",
        [
          "all",
          ["in", ["get", "boundary"], ["literal", ["administrative"]]],
          ["in", ["get", "admin_level"], ["literal", ["2", "4"]]]
        ], "uppercase",
        [
          "any",
          filters.is_continent,
          filters.is_ice,
          filters.is_landform_area_poi,
          filters.is_water_area_poi
        ], "uppercase",
        "none"
      ],
      "text-font":[
        "case",
        anyThemePointFeatureExp, ["literal", ["Noto Sans Bold"]],
        [
          "all",
          ["in", ["get", "boundary"], ["literal", ["administrative"]]],
          ["in", ["get", "admin_level"], ["literal", ["2"]]]
        ], ["literal", ["Noto Sans Bold"]],
        [
          "all",
          ["in", ["get", "boundary"], ["literal", ["administrative"]]],
          ["in", ["get", "admin_level"], ["literal", ["4"]]]
        ], ["literal", ["Noto Sans Medium"]],
        [
          "any",
          ["in", ["get", "place"], ["literal", ["city"]]],
          ["in", ["get", "boundary"], ["literal", ["administrative"]]]
        ], ["literal", ["Noto Sans SemiBold"]],
        [
          "any",
          filters.is_continent,
          filters.is_landform_area_poi,
          filters.is_peak,
          filters.is_waterfall,
        ], ["literal", ["Noto Serif Medium Italic"]],
        [
          "any",
          filters.is_ice,
          filters.is_water_area_poi
        ], ["literal", ["Noto Serif Medium Italic"]],
        ["literal", ["Noto Sans Medium"]]
      ],
      "text-letter-spacing": [
        "case",
        anyThemePointFeatureExp, 0,
        [
          "all",
          ["in", ["get", "boundary"], ["literal", ["administrative"]]],
          ["in", ["get", "admin_level"], ["literal", ["2", "4"]]]
        ], 0.15,
        [
          "any",
          filters.is_ice,
          filters.is_continent,
          filters.is_landform_area_poi,
          filters.is_water_area_poi
        ], 0.1,
        0
      ],
      "text-justify": "auto",
      "text-field": [
        "step", ["zoom"], getLabelExpression(lowZoomPointLabels),
        12, getLabelExpression(highZoomPointLabels)
      ]
    },
    "paint": {
      "text-color":[
        "case",
        anyThemePointFeatureExp, colors.primary_text,
        [
          "all",
          ["in", ["get", "boundary"], ["literal", ["administrative"]]],
          ["in", ["get", "admin_level"], ["literal", ["2", "4"]]]
        ], colors.text,
        ...structures.filter(info => info.text_color).toReversed().map(info => [info.filter, info.text_color]).flat(),
        ...landuses.filter(info => info.text_color).toReversed().map(info => [info.filter, info.text_color]).flat(),
        filters.is_water_area_poi, colors.water_text,
        filters.is_waterfall, colors.water_minor_text,
        colors.text
      ],
      "text-halo-color": colors.text_halo,
      "text-halo-width": [
        "case",
        anyThemePointFeatureExp, 2.5,
        1
      ],
      "text-halo-width": 1
    }
  };

  return {layer: layer, sprites: Object.keys(icons)};
}


function getLabelExpression(items) {
  let filters = ["case"];
  for(let i in items) {
    let item = items[i];

    if (item.caseSelector) filters.push(item.caseSelector);

    let filter = [
      "format",
      [
        "case",
        item.selector, item.sublabels ? [
          "concat",
          item.label,
          [
            "case",
            ["any", ...item.sublabels.map(item => item.selector)], '\n',
            ""
          ]
        ] : item.label,
        ""
      ],
      {},
    ];

    if (item.sublabels) {
      filter = filter.concat(getSublabelExpressions(item.sublabels));
    }
    filters.push(filter);
  }
  return filters;
}

function getSublabelExpressions(items) {
  let filters = [];
  for(let i in items) {
    let item = items[i];

    let sublabelsFilter = [];
    if (item.sublabels) {
      sublabelsFilter = [["any", ...item.sublabels.map(item => item.selector)], '\n'];
    }
    filters.push([
        "case",
        item.selector, [
          "concat", item.label,
          [
            "case",
            ["any", ...items.slice(parseInt(i) + 1).filter(item => !item.conjoined).map(item => item.selector)], " · ",
            ...sublabelsFilter,
            ""
          ]
        ],
        ""
      ]);
    filters.push({
      "text-font": item.font ? ["literal", [item.font]] : undefined
    });
  }
  return filters;
}