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
  is_aeroway: ["in", ["get", "aeroway"], ["literal", ["runway", "taxiway"]]],
  is_barrier: [
    "any",
    ["has", "barrier"],
    ["in", ["get", "man_made"], ["literal", ["breakwater", "dyke", "groyne"]]],
    ["in", ["get", "waterway"], ["literal", ["dam", "weir"]]]
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
  is_developed: ["in", ["get", "landuse"], ["literal", ["residential", "commercial", "industrial", "retail", "brownfield", "garages", "railway"]]],
  is_education: [
    "all",
    ["!", ["has", "building"]],
    [
      "any",
      ["has", "education"],
      ["in", ["get", "amenity"], ["literal", ["school", "college", "university"]]],
      ["in", ["get", "landuse"], ["literal", ["education"]]]
    ]
  ],
  is_ferry: ["==", ["get", "route"], "ferry"],
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
  is_highway: ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link", "primary", "primary_link", "secondary", "secondary_link", "tertiary", "tertiary_link", "residential", "unclassified", "pedestrian", "living_street", "service", "track", "path", "footway", "steps", "cycleway", "bridleway", "corridor"]]],
  is_ice: ["in", ["get", "natural"], ["literal", ["glacier"]]],
  is_landform_area_poi: [
    "any",
    ["in", ["get", "place"], ["literal", ["island", "islet", "archipelago"]]],
    ["in", ["get", "natural"], ["literal", ["desert", "mountain_range", "peninsula", "valley"]]]
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
  is_power_line: ["in", ["get", "power"], ["literal", ["line", "minor_line", "cable"]]],
  is_power_support:  ["in", ["get", "power"], ["literal", ["catenary_mast", "pole", "portal", "tower"]]],
  is_railway_track: ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]],
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
  is_water_coastal: ["==", ["get", "natural"], "coastline"],
  is_water_inland: ["==", ["get", "natural"], "water"],
  is_water_surface: [
    "all",
    ["==", ["get", "natural"], "water"],
    ["<=", ["to-number", ["get", "layer"], "0"], 0]
  ],
  is_watercourse: ["in", ["get", "waterway"], ["literal", ["canal", "ditch", "drain", "fish_pass", "river", "stream", "tidal_channel"]]],
  is_water_area_poi: [
    "any",
    ["in", ["get", "place"], ["literal", ["ocean", "sea"]]],
    ["in", ["get", "natural"], ["literal", ["bay", "strait", "water"]]]
  ]
};

const colors = {
  background: "#fff",
  text_halo: "#fff",
  text: "#555",

  barrier: "#D6CCCF",
  ferry: "#7EC2FF",
  power: "#D4BADE",
  highway_major: "#F7CF8D",
  highway_major_high_zoom: "#FFF2DD",
  highway_minor: "#cfcfcf",
  highway_minor_high_zoom: "#fff",
  highway_minor_high_zoom_tunnel: "#e6e6e6",
  highway_casing: "#d0d0d0",
  railway: "#969CAC",
  tree: "#268726",

  aboriginal_lands_fill: "#FFF8F2",
  aboriginal_lands_outline: "#DAD1C9",
  aboriginal_lands_text: "#6B533F",
  building_fill: "#807974",
  developed_fill: "#f9f9f9",
  education_fill: "#FFF9DB",
  education_outline: "#DED08C",
  education_text: "#575135",
  ice_fill: "#FAFDFF",
  ice_outline: "#C2DEED",
  ice_text: "#6193AE",
  maritime_park_fill: "#CEECED",
  maritime_park_outline: "#A4CED0",
  maritime_park_text: "#3B6769",
  military_fill: "#FDEFED",
  military_outline: "#D6BFBC",
  military_text: "#624946",
  national_park_fill: "#DAEDD5",
  national_park_outline: "#C1D6BD",
  national_park_text: "#3C5936",
  park_fill: "#ECFAE9",
  park_outline: "#B5D4AF",
  park_text: "#46693F",
  parking_fill: "#efefef",
  pier_fill: "#fff",
  place_major_text: "#111",
  power_fill: "#FBF4FE",
  power_outline: "#F0D5FA",
  power_text: "#54415C",
  station_fill: "#E3E9FA",
  station_outline: "#C2CCE6",
  station_text: "#3F4963",
  water: "#D4EEFF",
  water_text: "#114566",
  water_coastal_fill: "#D4EEFF",
  water_outline: "#BFD3E0",
  water_inland_fill: "#D4EEFF",
  water_surface_fill: "#D4EEFF",
  swimming_pool_fill: "#C4F1FF",
  swimming_pool_outline: "#BDE0EB",
};

const lineLayerWidth = [
  "interpolate", ["linear"], ["zoom"],
  12, [
    "case",
    filters.is_ferry, 1,
    filters.is_power_line, [
      "case", filters.has_subsurface_location, 1.85,
      0.85
    ],
    filters.is_railway_track, 0.8,
    filters.is_barrier_minor, 1,
    filters.is_watercourse, 2,
    ["any", ["in", ["get", "highway"], ["literal", ["motorway"]]], ["in", ["get", "aeroway"], ["literal", ["runway"]]]], 2,
    0.75
  ],
  14, [
    "case",
    filters.is_ferry, 1,
    filters.is_power_line, [
      "case", filters.has_subsurface_location, 1.85,
      0.85
    ],
    filters.is_railway_track, 0.8,
    filters.is_barrier_minor, 1,
    filters.is_watercourse, 2,
    ["any", ["in", ["get", "highway"], ["literal", ["motorway"]]], ["in", ["get", "aeroway"], ["literal", ["runway"]]]], 4,
    1.75
  ],
  18, [
    "case",
    filters.is_ferry, 2,
    filters.is_power_line, [
      "case", filters.has_subsurface_location, 1.85,
      0.85
    ],
    filters.is_railway_track, 0.8,
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
    ["all", ["<", ["zoom"], 13], filters.is_power_line, ["!", filters.has_subsurface_location]],
    filters.is_railway_track,
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
      ["all", filters.is_railway_track, filters.has_tunnel], 0.4,
      filters.is_railway_track, 1,
      filters.has_bridge, 0.4,
      1
    ],
    "line-width": [
      "interpolate", ["linear"], ["zoom"],
      14, [
        "case",
        filters.is_power_line, 0.75,
        filters.is_railway_track, 1.15,
        filters.has_bridge, 2,
        1
      ],
      18, [
        "case",
        filters.is_power_line, 0.75,
        filters.is_railway_track, 2,
        filters.has_bridge, 7,
        1
      ]
    ],
    "line-color": [
      "case",
      filters.is_power_line, colors.power,
      filters.is_railway_track, colors.railway,
      colors.highway_casing
    ],
    "line-gap-width": lineLayerWidth,
    "line-dasharray": [
      "case",
      filters.is_power_line, ["literal", [1.85, 25]],
      filters.is_railway_track, ["literal", [0.4, 4]],
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
    filters.is_railway_track,
    filters.is_power_line,
    filters.is_aeroway,
    ["all", [">=", ["zoom"], 12], filters.is_highway],
    filters.is_watercourse,
    filters.is_barrier
  ],
  "layout": {
    "line-join": "round",
    "line-cap": "butt",
    "line-sort-key": [
      "case",
      filters.is_power_line, 50,
      filters.is_barrier, 40,
      filters.is_railway_track, 30,
      filters.is_ferry, 20,
      filters.is_watercourse, 10,
      ["in", ["get", "highway"], ["literal", ["motorway", "trunk"]]], 5,
      ["in", ["get", "highway"], ["literal", ["motorway_link", "trunk_link"]]], -5,
      0
    ]
  },
  "paint": {
    "line-width": lineLayerWidth,
    "line-color": [
      "step", ["zoom"], [
        "case",
        filters.is_ferry, colors.ferry,
        filters.is_railway_track, colors.railway,
        filters.is_power_line, colors.power,
        filters.is_barrier, colors.barrier,
        filters.is_watercourse, [
          "case",
          filters.has_tunnel, "#C8E0F0",
          colors.water,
        ],
        ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], colors.highway_major,
        colors.highway_minor
      ],
      14,  [
        "case",
        filters.is_ferry, colors.ferry,
        filters.is_railway_track, colors.railway,
        filters.is_power_line, colors.power,
        filters.is_barrier, colors.barrier,
        filters.is_watercourse, [
          "case",
          filters.has_tunnel, "#C8E0F0",
          colors.water,
        ],
        ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], colors.highway_major_high_zoom,
        filters.has_tunnel, colors.highway_minor_high_zoom_tunnel,
        colors.highway_minor_high_zoom
      ]
    ],
    "line-opacity": [
      "case",
      ["all", ["any", filters.is_highway, filters.is_aeroway, filters.is_watercourse, filters.is_railway_track], filters.has_tunnel], 0.4,
      ["all", filters.is_power_line, filters.has_subsurface_location], 0.6,
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

const structureLayer = {
    "id": "structure-fill",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "fill",
    "filter": [
      "any",
      [
        "all",
        filters.is_water_inland,
        [">", ["to-number", ["get", "layer"], "0"], 0]
      ],
      filters.is_building,
      filters.is_barrier,
      filters.is_ice,
      filters.is_swimming_pool,
      ["in", ["get", "amenity"], ["literal", ["parking"]]],
      ["in", ["get", "man_made"], ["literal", ["pier", "bridge"]]]
    ],
    "layout": {
      "fill-sort-key": [
        "case",
        filters.is_building, 30,
        filters.is_swimming_pool, 25,
        filters.is_barrier, 20,
        ["in", ["get", "amenity"], ["literal", ["parking"]]], 15,
        ["in", ["get", "man_made"], ["literal", ["pier", "bridge"]]], 10,
        filters.is_ice, 5,
        filters.is_water_inland, 1,
        0
      ]
    },
    "paint": {
      "fill-opacity": [
        "case",
        filters.is_building, 0.5,
        ["in", ["get", "man_made"], ["literal", ["bridge"]]], 0.4,
        [">", ["to-number", ["get", "layer"], "0"], 0], 0.6,
        1
      ],
      "fill-color": [
        "case",
        filters.is_water_inland, colors.water_inland_fill,
        filters.is_ice, colors.ice_fill,
        filters.is_building, colors.building_fill,
        filters.is_barrier, colors.barrier,
        filters.is_swimming_pool, colors.swimming_pool_fill,
        ["in", ["get", "amenity"], ["literal", ["parking"]]], colors.parking_fill,
        ["in", ["get", "man_made"], ["literal", ["bridge"]]], colors.highway_casing,
        ["in", ["get", "man_made"], ["literal", ["pier"]]], colors.pier_fill,
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
      [
        "all",
        filters.is_water_inland,
        [">", ["to-number", ["get", "layer"], "0"], 0]
      ],
      filters.is_ice,
      filters.is_swimming_pool
    ],
    "layout": {
      "line-sort-key": [
        "case",
        filters.is_swimming_pool, 25,
        filters.is_ice, 5,
        filters.is_water_inland, 1,
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
        filters.is_water_inland, colors.water_outline,
        filters.is_ice, colors.ice_outline,
        filters.is_swimming_pool, colors.swimming_pool_outline,
        "red"
      ]
    }
};

export function generateStyle(baseStyleJsonString) {

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

  const filledLanduseIds = ["aboriginal_lands", "developed", "park", "national_park", "military", "education", "station", "power", "water_coastal", "water_surface", "maritime_park"];
  const highZoomFilledLanduseIds = ["developed", "water_coastal", "water_surface"];
  addLayer({
    "id": "landuse-fill",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "fill",
    "filter": [
      "any",
      ...filledLanduseIds.map(id => {
        if (highZoomFilledLanduseIds.includes(id)) {
          return filters['is_' + id];
        }
        return [
          "all",
          ["<", ["zoom"], 12],
          filters['is_' + id]
        ]
      })
    ],
    "layout": {
      "fill-sort-key": [
        "case",
        ...filledLanduseIds.map((id, i) => [filters['is_' + id], i]).flat(),
        0
      ]
    },
    "paint": {
      "fill-color": [
        "step", ["zoom"], [
          "case",
          ...filledLanduseIds.toReversed().map(id => [filters['is_' + id], colors[id + '_fill']]).flat(),
          "red"
        ],
        // Use step function to avoid incorrect coloring due to double tagging (e.g. landuse=industrial + power=plant)
        12, [
          "case",
          ...highZoomFilledLanduseIds.toReversed().map(id => [filters['is_' + id], colors[id + '_fill']]).flat(),
          "red"
        ]
      ]
    }
  });

  addLayer({
      "id": "coastline",
      "source": "beefsteak",
      "source-layer": "line",
      "type": "line",
      "filter": [
        "any",
        filters.is_coastline,
        filters.is_water_surface
      ],
      "layout": {
          "line-join": "round"
      },
      "paint": {
          "line-color": colors.water_outline,
          "line-width": 0.5
      }
  });

  addLayer({
    "id": "power-support",
    "source": "beefsteak",
    "source-layer": "point",
    "type": "circle",
    "filter": filters.is_power_support,
    "paint": {
      "circle-radius": [
        "interpolate", ["linear", 2], ["zoom"],
        15, 1.5,
        18, 2
      ],
      "circle-color": colors.power,
    },
    "minzoom": 13
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
  });
  addLayer({
    "id": "path-route",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "line",
    "filter": [
        "all",
        [
            "any",
            ["in", "┃hiking┃", ["get", "r.route"]],
            ["in", "┃foot┃", ["get", "r.route"]],
            ["in", "┃bicycle┃", ["get", "r.route"]],
            ["in", "┃horse┃", ["get", "r.route"]],
            ["in", "┃mtb┃", ["get", "r.route"]]
        ],
        ["!", ["in", "┃road┃", ["get", "r.route"]]],
        ["has", "highway"]
    ],
    "layout": {
        "line-join": "round",
        "line-cap": "round"
    },
    "paint": {
        "line-width": [
            "interpolate", ["linear"], ["zoom"],
            6, 1,
            18, 2
        ],
        "line-color": "#9db798",
        "line-dasharray": [0.5,2]
    },
    "maxzoom": 12
  });
  addLayer({
    "id": "road-route",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "line",
    "filter": [
        "all",
        ["in", "┃road┃", ["get", "r.route"]],
        ["has", "highway"]
    ],
    "layout": {
        "line-join": "round",
        "line-cap": "round"
    },
    "paint": {
        "line-width": [
            "interpolate", ["linear"], ["zoom"],
            6, [
                "case",
                ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], 1.5,
                1
            ],
            18, [
                "case",
                ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], 3.3,
                0.85
            ]
        ],
        "line-color": colors.highway_major
    },
    "maxzoom": 12
  });

  const insetLanduseIds = ["aboriginal_lands", "park", "national_park", "military", "education", "station", "power", "maritime_park"];
  addLayer({
    "id": "landuse-inset",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "line",
    "filter": [
      "any",
      ...insetLanduseIds.map(id => filters['is_' + id])
    ],
    "layout": {
      "line-join": "round",
      "line-sort-key": [
        "case",
        ...insetLanduseIds.map((id, i) => [filters['is_' + id], i]).flat(),
        0
      ]
    },
    "paint": {
      "line-opacity": 0.7,
      "line-color": [
        "case",
        ...insetLanduseIds.toReversed().map(id => [filters['is_' + id], colors[id + '_fill']]).flat(),
        "red"
      ],
      "line-width": 3.6,
      "line-offset": 1.8
    },
    "minzoom": 12
  });

  const outlinedLanduseIds = ["aboriginal_lands", "park", "national_park", "military", "education", "station", "power", "maritime_park"];

  addLayer({
    "id": "landuse-outline",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "line",
    "layout": {
      "line-sort-key": [
        "case",
        ...outlinedLanduseIds.map((id, i) => [filters['is_' + id], i]).flat(),
        0
      ]
    },
    "filter": [
      "any",
      ...outlinedLanduseIds.map(id => filters['is_' + id])
    ],
    "paint": {
      "line-color": [
        "case",
        ...outlinedLanduseIds.toReversed().map(id => [filters['is_' + id], colors[id + '_outline']]).flat(),
        "red"
      ],
      "line-width": 0.5
    }
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
        "line-color": "#fff",
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
          "line-color": "#ccc",
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
    "id": "tree",
    "source": "beefsteak",
    "source-layer": "point",
    "type": "circle",
    "filter": [
      "==", ["get", "natural"], "tree" 
    ],
    "paint": {
      "circle-radius": [
        "interpolate", ["exponential", 2], ["zoom"],
        15, 1.5,
        22, 192
      ],
      "circle-opacity": [
        "interpolate", ["linear"], ["zoom"],
        15, 0.2,
        22, 0.075
      ],
      "circle-color": colors.tree,
    },
    "minzoom": 15
  });

  addLayer({
    "id": "line-label",
    "source": "beefsteak",
    "source-layer": "line",
    "type": "symbol",
    "filter": [
      "any",
      filters.is_aeroway,
      filters.is_barrier,
      filters.is_ferry,
      filters.is_highway,
      filters.is_power_line,
      filters.is_railway_track,
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
        "text-field": ["coalesce", ["get", "name"], ["get", "ref"]]
    },
    "paint": {
        "text-color": [
            "case",
            filters.is_power_line, colors.power_text,
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
        filters.is_aboriginal_lands,
        filters.is_education,
        filters.is_park,
        filters.is_power,
        filters.is_maritime_park,
        filters.is_military,
        filters.is_national_park,
        filters.is_ice,
        filters.is_landform_area_poi,
        filters.is_water_area_poi,
        filters.is_station,
        filters.is_developed
    ],
    "layout": {
        "symbol-placement": "point",
        "symbol-sort-key": ["-", ["coalesce", ["get", "c.area"], 0]],
        "text-size":[
            "case",
            [
              "any",
              filters.is_ice,
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
              filters.is_landform_area_poi,
              filters.is_water_area_poi
            ], "uppercase",
            "none"
        ],
        "text-font":[
            "case",
            [
                "all",
                ["in", ["get", "boundary"], ["literal", ["administrative"]]],
                ["in", ["get", "admin_level"], ["literal", ["2", "4"]]]
            ], ["literal", ["Noto Sans Medium"]],
            ["any",["in", ["get", "place"], ["literal", ["city"]]],["in", ["get", "boundary"], ["literal", ["administrative"]]]], ["literal", ["Noto Sans Bold"]],
            [
              "any",
              filters.is_ice,
              filters.is_landform_area_poi,
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
              filters.is_landform_area_poi,
              filters.is_water_area_poi
            ], 0.1,
            0
        ],
        "text-field": ["coalesce", ["get", "name"], ["get", "ref"]]
    },
    "paint": {
        "text-color":[
            "case",
            [
                "all",
                ["in", ["get", "boundary"], ["literal", ["administrative"]]],
                ["in", ["get", "admin_level"], ["literal", ["2", "4"]]]
            ], colors.place_major_text,
            // These should be in roughly the same order as the fill precendence in case of double tagging (e.g. aeroway and military)
            filters.is_ice, colors.ice_text,
            filters.is_maritime_park, colors.maritime_park_text,
            filters.is_water_area_poi, colors.water_text,
            filters.is_power, colors.power_text,
            filters.is_station, colors.station_text,
            filters.is_education, colors.education_text,
            filters.is_military, colors.military_text,
            filters.is_national_park, colors.national_park_text,
            filters.is_park, colors.park_text,
            filters.is_aboriginal_lands, colors.aboriginal_lands_text,
            colors.text
        ],
        "text-halo-color": colors.text_halo,
        "text-halo-width": 1
    }
  });

  return style;
}