import chroma from './../node_modules/chroma-js/index.js';
import { colors } from "./colors.js";

import { getSpritesheets } from './spritesheetGenerator.js';

const noaccessValsLiteral = ["literal", ["no", "private", "discouraged", "limited"]]; // `limited` for `wheelchair`

const filters = {
  has_bridge: [
    "all",
    ["has", "bridge"],
    ["!", ["==", ["get", "bridge"], "no"]]
  ],
  has_intermittence: ["==", ["get", "intermittent"], "yes"],
  has_paving: [
    "any",
    [
        "all",
        ["!", ["has", "surface"]],
        ["!", ["in", ["get", "highway"], ["literal", ["track", "path"]]]]
    ],
    ["in", ["get", "surface"], ["literal", ["asphalt", "paved", "paving_stones", "concrete", "concrete:lanes", "concrete:plates", "wood", "metal", "metal_grid", "sett", "bricks", "cobblestone"]]]
  ],
  has_subsurface_location: ["in", ["get", "location"], ["literal", ["underground", "underwater", "indoor"]]],
  has_tunnel: [
    "all",
    ["has", "tunnel"],
    ["!", ["==", ["get", "tunnel"], "no"]]
  ],
  is_aboriginal_lands: ["==", ["get", "boundary"], "aboriginal_lands"],
  is_aerialway: ["has", "aerialway"],
  is_aerialway_support: ["==", ["get", "aerialway"], "pylon"],
  is_aeroway: ["in", ["get", "aeroway"], ["literal", ["runway", "taxiway"]]],
  is_barrier: [
    "any",
    ["has", "barrier"],
    ["in", ["get", "man_made"], ["literal", ["breakwater", "dyke", "groyne"]]],
    ["in", ["get", "waterway"], ["literal", ["dam", "weir"]]]
  ],
  is_barrier_minor: [
    "all",
    ["has", "barrier"],
    [
      "!",
      [
        "any",
        ["in", ["get", "man_made"], ["literal", ["breakwater", "dyke", "groyne"]]],
        ["in", ["get", "waterway"], ["literal", ["dam", "weir"]]]
      ]
    ]
  ],
  is_building: [
    "all",
    ["has", "building"],
    ["!", ["==", ["get", "building"], "no"]]
  ],
  is_coastline: [
    "all",
    ["==", ["get", "natural"], "coastline"],
    ["!", ["==", ["get", "maritime"], "yes"]]
  ],
  is_continent: ["==", ["get", "place"], "continent"],
  is_developed: ["in", ["get", "landuse"], ["literal", ["commercial", "construction", "industrial", "railway", "residential", "retail"]]],
  is_education: [
    "all",
    ["!", ["has", "building"]],
    ["!", ["all", ["has", "indoor"], ["!", ["==", ["get", "indoor"], "no"]]]],
    [
      "any",
      ["has", "education"],
      ["in", ["get", "amenity"], ["literal", ["school", "college", "university"]]]
    ]
  ],
  is_ferry: ["==", ["get", "route"], "ferry"],
  is_floating_boom: ["==", ["get", "barrier"], "floating_boom"],
  is_foot_route: [
    "all",
    ["has", "highway"],
    [
      "any",
      ["in", "┃hiking┃", ["get", "r.route"]],
      ["in", "┃foot┃", ["get", "r.route"]],
      ["in", "┃portage┃", ["get", "r.route"]]
    ]
  ],
  is_parking_lot: [
    "all",
    ["!", ["has", "building"]],
    ["!", ["in", ["get", "parking"], ["literal", ["multi-storey", "underground"]]]],
    ["==", ["get", "amenity"], "parking"]
  ],
  is_bridge: ["==", ["get", "man_made"], "bridge"],
  is_pier: ["==", ["get", "man_made"], "pier"],
  is_healthcare: [
    "all",
    ["!", ["has", "building"]],
    ["!", ["all", ["has", "indoor"], ["!", ["==", ["get", "indoor"], "no"]]]],
    [
      "any",
      ["has", "healthcare"],
      ["in", ["get", "amenity"], ["literal", ["hospital", "clinic"]]]
    ]
  ],
  is_highway: ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link", "primary", "primary_link", "secondary", "secondary_link", "tertiary", "tertiary_link", "residential", "unclassified", "pedestrian", "living_street", "service", "track", "path", "footway", "steps", "cycleway", "bridleway", "corridor"]]],
  is_ice: ["in", ["get", "natural"], ["literal", ["glacier"]]],
  is_outdoor_sports_facility: [
    "all",
    ["!", ["has", "building"]],
    ["!", ["all", ["has", "indoor"], ["!", ["==", ["get", "indoor"], "no"]]]],
    [
      "any",
      ["in", ["get", "leisure"], ["literal", ["golf_course",  "horse_riding"]]]
    ]
  ],
  is_outdoor_attraction: [
    "all",
    ["!", ["has", "building"]],
    ["!", ["all", ["has", "indoor"], ["!", ["==", ["get", "indoor"], "no"]]]],
    [
      "any",
      ["in", ["get", "leisure"], ["literal", ["miniature_golf", "water_park"]]],
      ["in", ["get", "tourism"], ["literal", ["aquarium", "gallery", "museum", "theme_park", "zoo"]]],
    ]
  ],
  is_landform_area_poi: [
    "any",
    ["in", ["get", "place"], ["literal", ["island", "islet", "archipelago"]]],
    ["in", ["get", "natural"], ["literal", ["desert", "mountain_range", "peninsula", "gorge", "valley"]]]
  ],
  is_maritime_park: [
    "all",
    [
      "any",
      ["==", ["get", "boundary"], "protected_area"],
      ["in", ["get", "leisure"], ["literal", ["nature_reserve", "park"]]]
    ],
    ["!", ["in", ["get", "protected_area"], ["literal", ["historic_district"]]]],
    ["==", ["get", "maritime"], "yes"]
  ],
  is_military: [
    "any",
    ["==", ["get", "landuse"], "military"],
    ["==", ["get", "military"], "base"]
  ],
  is_national_park: [
    "all",
    ["==", ["get", "boundary"], "protected_area"],
    ["==", ["get", "protected_area"], "national_park"],
    ["!", ["==", ["get", "maritime"], "yes"]]
  ],
  is_park: [
    "all",
    [
      "any",
      ["==", ["get", "boundary"], "protected_area"],
      ["in", ["get", "leisure"], ["literal", ["nature_reserve", "park"]]]
    ],
    ["!", ["in", ["get", "protected_area"], ["literal", ["national_park", "historic_district"]]]],
    ["!", ["==", ["get", "maritime"], "yes"]]
  ],
  is_power: ["in", ["get", "power"], ["literal", ["plant", "substation"]]],
  is_powerline: ["in", ["get", "power"], ["literal", ["line", "minor_line", "cable"]]],
  is_power_support:  ["in", ["get", "power"], ["literal", ["catenary_mast", "pole", "portal", "tower"]]],
  is_railway: ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]],
  is_religious: [
    "all",
    ["!", ["has", "building"]],
    ["!", ["all", ["has", "indoor"], ["!", ["==", ["get", "indoor"], "no"]]]],
    [
      "any",
      ["in", ["get", "amenity"], ["literal", ["place_of_worship", "monastery"]]],
      ["in", ["get", "landuse"], ["literal", ["cemetery"]]]
    ]
  ],
  is_station: [
    "all",
    ["!", ["has", "building"]],
    [
      "any",
      ["==", ["get", "public_transport"], "station"],
      ["==", ["get", "aeroway"], "aerodrome"],
      ["==", ["get", "railway"], "station"]
    ]
  ],
  is_swimming_pool: ["==", ["get", "leisure"], "swimming_pool"],
  is_tree: ["==", ["get", "natural"], "tree"],
  is_water_area_poi: [
    "any",
    ["in", ["get", "place"], ["literal", ["ocean", "sea"]]],
    ["in", ["get", "natural"], ["literal", ["bay", "strait", "water"]]]
  ],
  is_water_coastal: ["==", ["get", "natural"], "coastline"],
  is_water_structure: [
    "all",
    ["==", ["get", "natural"], "water"],
    [">", ["to-number", ["get", "layer"], "0"], 0]
  ],
  is_water_surface: [
    "all",
    ["==", ["get", "natural"], "water"],
    ["<=", ["to-number", ["get", "layer"], "0"], 0]
  ],
  is_watercourse: ["in", ["get", "waterway"], ["literal", ["canal", "ditch", "drain", "fish_pass", "river", "stream", "tidal_channel"]]],
};

const landuses = [
  {
    filter: filters.is_aboriginal_lands,
    fill_color: colors.aboriginal_lands_fill,
    outline_color: colors.aboriginal_lands_outline,
    text_color: colors.aboriginal_lands_text
  },
  {
    filter: filters.is_developed,
    fill_color: colors.developed_fill,
    text_color: colors.text,
    high_zoom: true
  },
  {
    filter: filters.is_park,
    fill_color: colors.park_fill,
    outline_color: colors.park_outline,
    text_color: colors.park_text
  },
  {
    filter: filters.is_national_park,
    fill_color: colors.national_park_fill,
    outline_color: colors.national_park_outline,
    text_color: colors.national_park_text
  },
  {
    filter: filters.is_military,
    fill_color: colors.military_fill,
    outline_color: colors.military_outline,
    text_color: colors.military_text
  },
  {
    filter: filters.is_education,
    fill_color: colors.education_fill,
    outline_color: colors.education_outline,
    text_color: colors.education_text
  },
  {
    filter: filters.is_religious,
    fill_color: colors.religious_fill,
    outline_color: colors.religious_outline,
    text_color: colors.religious_text
  },
  {
    filter: filters.is_outdoor_sports_facility,
    fill_color: colors.outdoor_sports_facility_fill,
    outline_color: colors.outdoor_sports_facility_outline,
    text_color: colors.outdoor_sports_facility_text
  },
  {
    filter: filters.is_outdoor_attraction,
    fill_color: colors.outdoor_attraction_fill,
    outline_color: colors.outdoor_attraction_outline,
    text_color: colors.outdoor_attraction_text
  },
  {
    filter: filters.is_healthcare,
    fill_color: colors.healthcare_fill,
    outline_color: colors.healthcare_outline,
    text_color: colors.healthcare_text
  },
  {
    filter: filters.is_station,
    fill_color: colors.station_fill,
    outline_color: colors.station_outline,
    text_color: colors.station_text
  },
  {
    filter: filters.is_power,
    fill_color: colors.power_fill,
    outline_color: colors.power_outline,
    text_color: colors.power_text
  },
  {
    filter: filters.is_water_coastal,
    fill_color: colors.water_fill,
    high_zoom: true
  },
  {
    filter: filters.is_water_surface,
    fill_color: colors.water_fill,
    outline_color: colors.water_outline,
    high_zoom: true
  },
  {
    filter: filters.is_maritime_park,
    fill_color: colors.maritime_park_fill,
    outline_color: colors.maritime_park_outline,
    text_color: colors.maritime_park_text
  },
  {
    filter: filters.is_ice,
    fill_color: colors.ice_fill,
    outline_color: colors.ice_outline,
    text_color: colors.ice_text,
    high_zoom: true
  }
];

const structures = [
  {
    filter: filters.is_water_structure,
    fill_color: colors.water_fill,
    outline_color: colors.water_outline
  },
  {
    filter: filters.is_pier,
    fill_color: colors.pier_fill,
    text_color: colors.text,
  },
  {
    filter: filters.is_bridge,
    fill_color: colors.highway_casing,
    text_color: colors.text,
    fill_opacity: 0.4
  },
  {
    filter: filters.is_parking_lot,
    fill_color: colors.parking_fill,
    text_color: colors.text
  },
  {
    filter: filters.is_barrier,
    fill_color: colors.barrier_fill,
    text_color: colors.text
  },
  {
    filter: filters.is_swimming_pool,
    fill_color: colors.swimming_pool_fill,
    outline_color: colors.swimming_pool_outline,
    text_color: colors.swimming_pool_text
  },
  {
    filter: filters.is_building,
    fill_color: colors.building_fill,
    fill_opacity: 0.5
  },
];

const lineLayerLineWidth = [
  "interpolate", ["linear"], ["zoom"],
  12, [
    "case",
    filters.is_ferry, 1,
    filters.is_powerline, [
      "case", filters.has_subsurface_location, 1.85,
      0.85
    ],
    filters.is_railway, 0.8,
    filters.is_barrier_minor, 1,
    filters.is_watercourse, 2,
    ["any", ["in", ["get", "highway"], ["literal", ["motorway"]]], ["in", ["get", "aeroway"], ["literal", ["runway"]]]], 2,
    1
  ],
  14, [
    "case",
    filters.is_ferry, 1,
    filters.is_powerline, [
      "case", filters.has_subsurface_location, 1.85,
      0.85
    ],
    filters.is_railway, 0.8,
    filters.is_barrier_minor, 1,
    filters.is_watercourse, 2,
    ["any", ["in", ["get", "highway"], ["literal", ["motorway"]]], ["in", ["get", "aeroway"], ["literal", ["runway"]]]], 4,
    1.75
  ],
  18, [
    "case",
    filters.is_ferry, 2,
    filters.is_powerline, [
      "case", filters.has_subsurface_location, 1.85,
      0.85
    ],
    filters.is_aerialway, 1.75,
    filters.is_railway, 0.8,
    filters.is_barrier_minor, 1.5,
    ["in", ["get", "waterway"], ["literal", ["stream", "drain", "ditch", "tidal_channel", "fish_pass"]]], 4,
    ["in", ["get", "highway"], ["literal", ["path", "footway", "steps", "bridleway", "corridor"]]], 2.5,
    ["in", ["get", "highway"], ["literal", ["service", "track", "cycleway"]]], 7,
    ["in", ["get", "waterway"], ["literal", ["river", "canal"]]], 16,
    ["in", ["get", "highway"], ["literal", ["motorway_link", "trunk", "trunk_link", "primary", "secondary", "tertiary"]]], 19,
    ["any", ["in", ["get", "highway"], ["literal", ["motorway"]]], ["in", ["get", "aeroway"], ["literal", ["runway"]]]], 26,
    12
  ]
];

const lineCasingLayer = {
  "id": "line-casing",
  "source": "beefsteak",
  "source-layer": "line",
  "type": "line",
  "filter": [
    "any",
    ["all", ["<", ["zoom"], 12], filters.is_powerline, ["!", filters.has_subsurface_location]],
    filters.is_railway,
    ["all", [">=", ["zoom"], 14], filters.is_aeroway],
    ["all", [">=", ["zoom"], 14], filters.is_highway],
    ["all", filters.is_watercourse, ["any", filters.has_tunnel, filters.has_bridge]]
  ],
  "layout": {
    "line-join": "round",
    "line-cap": "butt"
  },
  "paint": {
    "line-opacity": [
      "case",
      ["all", ["any", filters.is_highway, filters.is_aeroway, filters.is_watercourse], filters.has_tunnel], 0.7,
      ["all", filters.is_railway, filters.has_tunnel], 0.4,
      filters.is_railway, 1,
      filters.has_bridge, 0.4,
      1
    ],
    "line-width": [
      "interpolate", ["linear"], ["zoom"],
      14, [
        "case",
        filters.is_powerline, 0.75,
        filters.is_railway, 1.15,
        filters.has_bridge, 2,
        1
      ],
      18, [
        "case",
        filters.is_powerline, 0.75,
        filters.is_railway, 2,
        filters.has_bridge, 7,
        1
      ]
    ],
    "line-color": [
      "case",
      filters.is_powerline, colors.powerline_stroke,
      filters.is_railway, colors.railway_stroke,
      colors.highway_casing
    ],
    "line-gap-width": lineLayerLineWidth,
    "line-dasharray": [
      "case",
      filters.is_powerline, ["literal", [1.85, 25]],
      filters.is_railway, ["literal", [0.25, 4]],
      ["!", filters.has_paving], ["literal", [3, 2]],
      ["all", ["any", filters.is_highway, filters.is_aeroway, filters.is_watercourse], filters.has_tunnel], ["literal", [8, 4]],
      ["literal", [1]]
    ]
  }
};

const lineLayer = {
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
        ["in", "┃road┃", ["get", "r.route"]]
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
    "line-width": lineLayerLineWidth,
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

const lineOverlayLayer = {
  "id": "line-overlay",
  "source": "beefsteak",
  "source-layer": "line",
  "type": "line",
  "filter": [
    "any",
    filters.is_foot_route,
    filters.is_floating_boom
  ],
  "layout": {
    "line-join": "round",
    "line-cap": "round"
  },
  "paint": {
    "line-width": [
      "interpolate", ["exponential", 2], ["zoom"],
      12, [
         "case",
        filters.is_floating_boom, 2,
        1
      ],
      18, [
         "case",
        filters.is_floating_boom, 9,
        1
      ],
    ],
    "line-color": [
      "case",
      filters.is_floating_boom, colors.floating_boom_stroke,
      colors.route_foot_overlay
    ],
    "line-dasharray": [
      "case",
      filters.is_floating_boom, ["literal", [0.6, 3]],
      ["literal", [2.625, 2.375]]
    ]
  }
};

const structureLayer = {
  "id": "structure-fill",
  "source": "beefsteak",
  "source-layer": "area",
  "type": "fill",
  "filter": [
    "any",
    ...structures.filter(info => info.fill_color).map(info => info.filter)
  ],
  "layout": {
    "fill-sort-key": [
      "case",
      ...structures.filter(info => info.fill_color).map((info, i) => [info.filter, i]).flat(),
      0
    ]
  },
  "paint": {
    "fill-opacity": [
      "case",
      ...structures.filter(info => info.fill_color && info.fill_opacity).toReversed().map(info => [info.filter, info.fill_opacity]).flat(),
      [">", ["to-number", ["get", "layer"], "0"], 0], 0.6,
      1
    ],
    "fill-color": [
      "case",
      ...structures.filter(info => info.fill_color).toReversed().map(info => [info.filter, info.fill_color]).flat(),
      "red"
    ]
  }
};

const structureOutlineLayer = {
  "id": "structure-outline",
  "source": "beefsteak",
  "source-layer": "area",
  "type": "line",
  "filter": [
    "any",
    ...structures.filter(info => info.outline_color).map(info => info.filter)
  ],
  "layout": {
    "line-sort-key": [
      "case",
      ...structures.filter(info => info.outline_color).map((info, i) => [info.filter, i]).flat(),
      0
    ]
  },
  "paint": {
    "line-opacity": [
      "case",
      [">", ["to-number", ["get", "layer"], "0"], 0], 0.75,
      1
    ],
    "line-width": 0.5,
    "line-color": [
      "case",
      ...structures.filter(info => info.outline_color).toReversed().map(info => [info.filter, info.outline_color]).flat(),
      "red"
    ]
  }
};

let diegeticPointLayer = {
  "id": "diegetic-point",
  "source": "beefsteak",
  "source-layer": "point",
  "type": "circle",
  "filter": [
    "any",
    filters.is_power_support,
    filters.is_aerialway_support,
    [
      "all",
      filters.is_tree,
      [">=", ["zoom"], 15]
    ]
  ],
  "paint": {
    "circle-radius": [
      "interpolate", ["exponential", 2], ["zoom"],
      15, [
        "case",
        filters.is_tree, 1.5,
        1.75
      ],
      22, [
        "case",
        filters.is_tree, 192,
        16
      ]
    ],
    "circle-opacity": [
      "interpolate", ["linear"], ["zoom"],
      15, [
        "case",
        filters.is_tree, 0.2,
        1
      ],
      22, [
        "case",
        filters.is_tree, 0.075,
        1
      ],
    ],
    "circle-color": [
      "case",
      filters.is_tree, colors.tree,
      filters.is_power_support, colors.powerline_stroke,
      filters.is_aerialway_support, colors.aerialway_stroke,
      "red"
    ]
  },
  "minzoom": 12
};

function tagsExp(tags) {
  let exp = [];
  for (let key in tags) {
    let val = tags[key];
    if (val === '*') {
      exp.push(['has', key]);
    } else {
      exp.push(
        [
          "all",
          ["has", key],
          [
            "any",
            // check if exact match (one item in list)
            ["==", ["get", key], val],
            // check if item is listed between others
            ["in", `;${val};`, ["get", key]],
            // check if item is first in list
            ["==", ["slice", ["get", key], 0, ["length", `${val};`]], `${val};`],
            // check if item is last in list
            ["==", ["slice", ["get", key], ["-", ["length", ["get", key]], ["length", `;${val}`]]], `;${val}`]
          ]
        ]
      );
    }
  }
  if (exp.length === 1) {
    return exp[0];
  } else {
    exp.unshift("all");
    return exp;
  }
}

export async function generateStyle(baseStyleJsonString, theme) {

  const featuresToRender = theme ? theme.features.map(item => {
    let feature = Object.assign({}, item);
    feature.exp = tagsExp(feature.tags);
    return feature;
  }) : [];

  let icons = {};
  function iconExp(file, opts) {
    let id = file;
    if (opts.fill === 'none') delete opts.fill; // sense check
    if (opts.fill) {
      opts.fill = opts.fill.toLowerCase().trim();
      id += ' f-' + opts.fill;
    }
    if (opts.stroke) {
      opts.stroke = opts.stroke.toLowerCase().trim();
      id += ' s-' + opts.stroke;
    }
    if (opts.halo) {
      opts.halo = opts.halo.toLowerCase().trim();
      id += ' h-' + opts.halo;
    }
    if (opts.bg_fill) {
      opts.bg_fill = opts.bg_fill.toLowerCase().trim();
      id += ' bg-' + opts.bg_fill;
    }
    opts.id = id
    opts.file = file;
    icons[id] = opts;
    return ["image", id];
  }

  const userLangs = navigator.languages ? navigator.languages : navigator.language ? [navigator.language] : [];
  const osmLangSuffixes = [];
  userLangs.forEach(userLang => {
    const parts = userLang.split('-');
    while (parts.length) {
      const builtLang = ':' + parts.join('-');
      if (!osmLangSuffixes.includes(builtLang)) osmLangSuffixes.push(builtLang);
      parts.pop();
    }
  });
  osmLangSuffixes.push('');

  const localizedName = ["coalesce", ...osmLangSuffixes.map(suffix => ["get", "name" + suffix]), ["get", "ref"]];
  // const nativeName = ["coalesce", ["get", "name"], ["get", "ref"]];
  // const labelTextField = [
  //   "case",
  //   [
  //     "all",
  //     ["!", ["in", ["get", "place"], ["literal", ["continent", "ocean", "sea"]]]],
  //     ["!", ["in", localizedName, nativeName]]
  //   ], ["format", localizedName, {},"\n", {}, nativeName, {"font-scale": 0.85}],
  //   localizedName
  // ];
  const labelTextField = localizedName;

  // parse anew every time to avoid object references
  const style = JSON.parse(baseStyleJsonString);

  function addLayer(layer) {
    style.layers.push(layer);
  }

  addLayer({
    "id": "background",
    "type": "background",
    "paint": {
        "background-color": colors.background
    }
  });
  addLayer({
    "id": "landuse-fill",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "fill",
    "filter": [
      "any",
      ...landuses.filter(info => info.fill_color).map(info => {
        if (info.high_zoom) return info.filter;
        return [
          "all",
          ["<", ["zoom"], 12],
          info.filter
        ];
      })
    ],
    "layout": {
      "fill-sort-key": [
        "case",
        ...landuses.filter(info => info.fill_color).map((info, i) => [info.filter, i]).flat(),
        0
      ]
    },
    "paint": {
      "fill-color": [
        "step", ["zoom"], [
          "case",
          ...landuses.filter(info => info.fill_color).toReversed().map(info => [info.filter, info.fill_color]).flat(),
          "red"
        ],
        // Use step function to avoid incorrect coloring due to double tagging (e.g. landuse=industrial + power=plant)
        12, [
          "case",
          ...landuses.filter(info => info.fill_color && info.high_zoom).toReversed().map(info => [info.filter, info.fill_color]).flat(),
          "red"
        ]
      ]
    }
  });
  addLayer({
    "id": "landuse-inset",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "line",
    "filter": [
      "any",
      ...landuses.filter(info => info.fill_color && !info.high_zoom).map(info => info.filter)
    ],
    "layout": {
      "line-join": "round",
      "line-sort-key": [
        "case",
        ...landuses.filter(info => info.fill_color && !info.high_zoom).map((info, i) => [info.filter, i]).flat(),
        0
      ]
    },
    "paint": {
      "line-opacity": 0.7,
      "line-color": [
        "case",
        ...landuses.filter(info => info.fill_color && !info.high_zoom).toReversed().map(info => [info.filter, info.fill_color]).flat(),
        "red"
      ],
      "line-width": 3.6,
      "line-offset": 1.8
    },
    "minzoom": 12
  });
  addLayer({
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
  });
  addLayer({
      "id": "surface-landuse-outline",
      "source": "beefsteak",
      "source-layer": "area",
      "type": "line",
      "filter": [
        "any",
        ...landuses.filter(info => info.outline_color && info.high_zoom).map(info => info.filter)
      ],
      "layout": {
          "line-join": "round"
      },
      "paint": {
          "line-color": [
            "case",
            ...landuses.filter(info => info.outline_color && info.high_zoom).toReversed().map(info => [info.filter, info.outline_color]).flat(),
            "red"
          ],
          "line-width": 0.5
      }
  });
  addLayer({
    "id": "landuse-outline",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "line",
    "filter": [
      "any",
      ...landuses.filter(info => info.outline_color && !info.high_zoom).map(info => info.filter)
    ],
    "layout": {
      "line-sort-key": [
        "case",
        ...landuses.filter(info => info.outline_color && !info.high_zoom).map((info, i) => [info.filter, i]).flat(),
        0
      ]
    },
    "paint": {
      "line-color": [
        "case",
        ...landuses.filter(info => info.outline_color && !info.high_zoom).toReversed().map(info => [info.filter, info.outline_color]).flat(),
        "red"
      ],
      "line-width": 0.5
    }
  });

  function forTagLayer(layer, tagLayer) {
    let newLayer = Object.assign({}, layer);
    newLayer.id += tagLayer;
    let layerFilter;
    if (tagLayer === '0') {
      layerFilter = [
        "any",
        ["!", ["has", "layer"]],
        ["==", ["get", "layer"], "0"]
      ];
    } else if (tagLayer === '-3') {
      layerFilter = ["<=", ["to-number", ["get", "layer"], "0"], -2];
    } else if (tagLayer === '3') {
      layerFilter = [">=", ["to-number", ["get", "layer"], "0"], 2];
    } else {
      layerFilter = ["==", ["get", "layer"], tagLayer];
    }
    newLayer.filter = [
      "all",
      layerFilter,
      newLayer.filter
    ];
    return newLayer;
  }

  ["-3","-2","-1","0","1","2","3"].forEach(tagLayer => {
    addLayer(forTagLayer(structureLayer, tagLayer));
    addLayer(forTagLayer(structureOutlineLayer, tagLayer));
    addLayer(forTagLayer(lineCasingLayer, tagLayer));
    addLayer(forTagLayer(lineLayer, tagLayer));
    addLayer(forTagLayer(lineOverlayLayer, tagLayer));
    addLayer(forTagLayer(diegeticPointLayer, tagLayer));
  });

  addLayer({
    "id": "boundary-casing",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "line",
    "filter": [
        "all",
        ["in", "┃administrative┃", ["get", "r.boundary"]],
        [
          "any",
          ["in", "┃2┃", ["get", "r.admin_level"]],
          ["in", "┃4┃", ["get", "r.admin_level"]],
          ["in", "┃6┃", ["get", "r.admin_level"]],
          ["in", "┃8┃", ["get", "r.admin_level"]]
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
          ["in", "┃6┃", ["get", "r.admin_level"]],
          ["in", "┃8┃", ["get", "r.admin_level"]]
        ], 2,
        ["in", "┃4┃", ["get", "r.admin_level"]], 2.5,
        3
      ]
    }
  });

  addLayer({
    "id": "boundary",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "line",
    "filter": [
      "all",
      ["in", "┃administrative┃", ["get", "r.boundary"]],
      [
        "any",
        ["in", "┃2┃", ["get", "r.admin_level"]],
        ["in", "┃4┃", ["get", "r.admin_level"]],
        ["in", "┃6┃", ["get", "r.admin_level"]],
        ["in", "┃8┃", ["get", "r.admin_level"]]
      ],
      ["!", ["==", ["get", "maritime"], "yes"]]
    ],
    "paint": {
      "line-color": colors.admin_boundary_stroke,
      "line-width": [
        "case",
        ["in", "┃2┃", ["get", "r.admin_level"]], 1.75,
        ["in", "┃4┃", ["get", "r.admin_level"]], 1.5,
        1
      ],
      "line-dasharray": [
        "case",
        ["in", "┃2┃", ["get", "r.admin_level"]], ["literal", [10, 1, 2, 1]],
        ["in", "┃4┃", ["get", "r.admin_level"]], ["literal", [6, 1, 2, 1, 2, 1]],
        ["literal", [6, 3, 3, 3]]
      ]
    }
  });

  addLayer({
    "id": "line-label",
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
        "text-size": 10.5,
        "text-font": [
            "case",
            filters.is_watercourse, ["literal", ["Noto Serif Italic"]],
            ["literal", ["Noto Sans Regular"]]
        ],
        "text-field": labelTextField
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
  });

  addLayer({
    "id": "point-label",
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
      ...featuresToRender.map(feature => feature.exp)
    ],
    "layout": {
      "symbol-placement": "point",
      "text-optional": true,
      "symbol-sort-key": [
        "case",
        [
          "any",
          ...featuresToRender.map(feature => feature.exp)
        ],
          // Prioritize the focused features by making sure the sort value is always
          // lower than that of the largest possible Web Mercator feature
          ["-", -1.6e15, ["coalesce", ["get", "c.area"], 0]],
        ["-", ["coalesce", ["get", "c.area"], 0]]
      ],
      "icon-image": featuresToRender.filter(feature => feature.icon).length ? [
        "case",
        ...featuresToRender.filter(feature => feature.icon).map(feature => {
          let noaccessIconOpts = Object.assign({}, feature.iconOpts);
          if (noaccessIconOpts.fill) {
            noaccessIconOpts.fill = chroma.mix(noaccessIconOpts.fill, "#eee", 0.5, "rgb").hex();
          }
          if (noaccessIconOpts.bg_fill) {
            noaccessIconOpts.bg_fill = chroma.mix(noaccessIconOpts.bg_fill, "#eee", 0.5, "rgb").hex();
          }
          return [feature.exp, [
            "case",
            ["in", ["get", "access"], noaccessValsLiteral],
              iconExp(feature.icon, noaccessIconOpts),
            iconExp(feature.icon, feature.iconOpts)
          ]];
        }).flat(),
        ["image", ""]
      ] : ["image", ""],
      "text-variable-anchor-offset": featuresToRender.filter(feature => feature.icon).length ? [
        "case",
        ...featuresToRender.filter(feature => feature.icon && feature.iconOpts?.fill).map(feature => {
          return [feature.exp, ["literal", ["left", [1.1, 0], "right", [-1.1, 0]]]]
        }).flat(),
        ...featuresToRender.filter(feature => feature.icon && !feature.iconOpts?.fill).map(feature => {
          return [feature.exp, ["literal", ["left", [0.8, 0], "right", [-0.8, 0]]]]
        }).flat(),
        ["literal", ["center", [0, 0]]]
      ] : ["literal", ["center", [0, 0]]],
      "text-size":[
        "case",
        [
          "any",
          filters.is_ice,
          filters.is_continent,
          filters.is_landform_area_poi,
          filters.is_water_area_poi
        ], 10,
        10.5
      ],
      "text-transform":[
        "case",
        [
          "all",
          ["in", ["get", "boundary"], ["literal", ["administrative"]]],
          ["in", ["get", "admin_level"], ["literal", ["2", "4"]]]
        ], "uppercase",
        [
          "any",
          filters.is_ice,
          filters.is_continent,
          filters.is_landform_area_poi,
          filters.is_water_area_poi
        ], "uppercase",
        "none"
      ],
      "text-font":[
        "case",
        ["any", ...featuresToRender.map(feature => feature.exp)], ["literal", ["Noto Sans Bold"]],
        [
          "all",
          ["in", ["get", "boundary"], ["literal", ["administrative"]]],
          ["in", ["get", "admin_level"], ["literal", ["2", "4"]]]
        ], ["literal", ["Noto Sans Medium"]],
        ["any",["in", ["get", "place"], ["literal", ["city"]]],["in", ["get", "boundary"], ["literal", ["administrative"]]]], ["literal", ["Noto Sans Bold"]],
        [
          "any",
          filters.is_continent,
          filters.is_landform_area_poi,
        ], ["literal", ["Noto Serif Medium Italic"]],
        [
          "any",
          filters.is_ice,
          filters.is_water_area_poi
        ], ["literal", ["Noto Serif Medium Italic"]],
        ["literal", ["Noto Sans Medium"]]
      ],
      "text-letter-spacing":[
        "case",
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
      "text-field": labelTextField
    },
    "paint": {
      "text-color":[
        "case",
        ["any", ...featuresToRender.map(feature => feature.exp)], colors.primary_text,
        [
          "all",
          ["in", ["get", "boundary"], ["literal", ["administrative"]]],
          ["in", ["get", "admin_level"], ["literal", ["2", "4"]]]
        ], colors.admin_boundary_major_text,
        ...structures.filter(info => info.text_color).toReversed().map(info => [info.filter, info.text_color]).flat(),
        ...landuses.filter(info => info.text_color).toReversed().map(info => [info.filter, info.text_color]).flat(),
        filters.is_water_area_poi, colors.water_text,
        colors.text
      ],
      "text-halo-color": colors.text_halo,
      "text-halo-width": [
        "case",
        ["any", ...featuresToRender.map(feature => feature.exp)], 2.5,
        1
      ],
      "text-halo-width": 1
    }
  });

  let sprites = await getSpritesheets(icons);

  return {
    style: style,
    spritesheets: sprites
  };
}