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
    ["in", ["get", "surface"], ["literal", ["asphalt", "paved", "paving_stones", "concrete", "wood", "metal", "sett", "bricks", "cobblestone"]]]
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
  is_maritime_park: [
    "all",
    [
      "any",
      ["==", ["get", "boundary"], "protected_area"],
      ["in", ["get", "leisure"], ["literal", ["nature_reserve", "park"]]]
    ],
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
  is_natural_area: [
    "any",
    ["in", ["get", "place"], ["literal", ["ocean", "sea", "island", "islet", "archipelago"]]],
    ["in", ["get", "natural"], ["literal", ["bay", "desert", "mountain_range", "peninsula", "strait", "valley", "water"]]]
  ],
  is_park: [
    "all",
    [
      "any",
      ["==", ["get", "boundary"], "protected_area"],
      ["in", ["get", "leisure"], ["literal", ["nature_reserve", "park"]]]
    ],
    ["!", ["==", ["get", "protected_area"], "national_park"]],
    ["!", ["==", ["get", "maritime"], "yes"]]
  ],
  is_power_line: ["in", ["get", "power"], ["literal", ["line", "minor_line", "cable"]]],
  is_power_support:  ["in", ["get", "power"], ["literal", ["catenary_mast", "pole", "portal", "tower"]]],
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
  is_railway_track: ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]],
  is_water: [
    "any",
    ["in", ["get", "natural"], ["literal", ["coastline", "water"]]],
    ["in", ["get", "leisure"], ["literal", ["swimming_pool"]]]
  ],
  is_watercourse: ["in", ["get", "waterway"], ["literal", ["canal", "ditch", "drain", "fish_pass", "flowline", "link", "river", "stream", "tidal_channel"]]],
  is_water_area: [
    "any",
    ["in", ["get", "place"], ["literal", ["ocean", "sea"]]],
    ["in", ["get", "natural"], ["literal", ["bay", "desert", "strait", "water"]]]
  ]
};

const colors = {
  background: "#fff",
  barrier: "#D6CCCF",
  building: "#807974",
  ferry: "#7EC2FF",
  parking: "#f0f0f0",
  pier: "#fff",
  power: "#D4BADE",
  highway_major: "#F7CF8D",
  highway_major_high_zoom: "#FFF2DD",
  highway_minor: "#cfcfcf",
  highway_minor_high_zoom: "#fff",
  highway_casing: "#d0d0d0",
  railway: "#969CAC",
  tree: "#268726",
  water: "#D4EEFF",

  aboriginal_lands_fill: "#FFF8F2",
  aboriginal_lands_outline: "#DAD1C9",
  developed_fill: "#F6F6F6",
  education_fill: "#FFF9DB",
  education_outline: "#DED08C",
  maritime_park_fill: "#CEECED",
  maritime_park_outline: "#A4CED0",
  military_fill: "#FDEFED",
  military_outline: "#D6BFBC",
  national_park_fill: "#DAEDD5",
  national_park_outline: "#A7C5A2",
  park_fill: "#ECFAE9",
  park_outline: "#B5D4AF",
  station_fill: "#E3E9FA",
  station_outline: "#A3B0D3",
  water_fill: "#D4EEFF",
  water_outline: "#BFD3E0",
  water_text: "#114566"
};

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
    filters.is_watercourse
  ],
  "layout": {
    "line-join": "round",
    "line-cap": "butt"
  },
  "paint": {
    "line-opacity": [
      "case",
      filters.is_railway_track, 1,
      filters.has_bridge, 0.4,
      1
    ],
    "line-width": [
      "interpolate", ["linear"], ["zoom"],
      14, [
        "case",
        filters.is_power_line, 1.9,
        filters.is_railway_track, 2.25,
        filters.has_bridge, 10.75,
        filters.is_watercourse, 2,
        3.75
      ],
      18, [
        "case",
        filters.is_power_line, 1.9,
        filters.is_railway_track, 3,
        filters.has_bridge, [
            "case",
            ["in", ["get", "highway"], ["literal", ["path", "footway", "steps", "bridleway", "corridor"]]], 13,
            ["in", ["get", "highway"], ["literal", ["service", "track", "cycleway"]]], 16,
            ["in", ["get", "highway"], ["literal", ["motorway_link", "trunk", "trunk_link", "primary", "secondary", "tertiary"]]], 28,
            ["any", ["in", ["get", "highway"], ["literal", ["motorway"]]], ["in", ["get", "aeroway"], ["literal", ["runway"]]]], 36,
            21
        ],
        [
            "case",
            ["in", ["get", "waterway"], ["literal", ["stream", "drain", "ditch", "tidal_channel", "fish_pass", "flowline", "link"]]], 3,
            ["in", ["get", "waterway"], ["literal", ["river", "canal"]]], 13,
            ["in", ["get", "highway"], ["literal", ["path", "footway", "steps", "bridleway", "corridor"]]], 5.5,
            ["in", ["get", "highway"], ["literal", ["service", "track", "cycleway"]]], 8.5,
            ["in", ["get", "highway"], ["literal", ["motorway_link", "trunk", "trunk_link", "primary", "secondary", "tertiary"]]], 20.5,
            ["any", ["in", ["get", "highway"], ["literal", ["motorway"]]], ["in", ["get", "aeroway"], ["literal", ["runway"]]]], 27.5,
            13.5
        ]
      ]
    ],
    "line-color": [
      "case",
      filters.is_power_line, colors.power,
      filters.is_railway_track, colors.railway,
      colors.highway_casing
    ],
    "line-dasharray": [
      "case",
      filters.is_power_line, ["literal", [1, 8]],
      filters.is_railway_track, ["literal", [0.4, 1.5]],
      filters.has_paving, ["literal", [1]],
      ["literal", [0.85, 1]]
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
      ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], -10,
      0
    ]
  },
  "paint": {
    "line-width": [
      "interpolate", ["linear"], ["zoom"],
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
        ["in", ["get", "highway"], ["literal", ["path", "footway", "steps", "bridleway", "corridor"]]], 4,
        ["in", ["get", "highway"], ["literal", ["service", "track", "cycleway"]]], 7,
        ["in", ["get", "highway"], ["literal", ["motorway_link", "trunk", "trunk_link", "primary", "secondary", "tertiary"]]], 19,
        ["any", ["in", ["get", "highway"], ["literal", ["motorway"]]], ["in", ["get", "aeroway"], ["literal", ["runway"]]]], 26,
        ["in", ["get", "waterway"], ["literal", ["stream", "drain", "ditch", "tidal_channel", "fish_pass", "flowline"]]], 6,
        ["in", ["get", "waterway"], ["literal", ["river", "canal"]]], 16,
        12
      ]
    ],
    "line-color": [
      "step", ["zoom"], [
        "case",
        filters.is_ferry, colors.ferry,
        filters.is_railway_track, colors.railway,
        filters.is_power_line, colors.power,
        filters.is_barrier, colors.barrier,
        filters.is_watercourse, colors.water,
        ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], colors.highway_major,
        colors.highway_minor
      ],
      14,  [
        "case",
        filters.is_ferry, colors.ferry,
        filters.is_railway_track, colors.railway,
        filters.is_power_line, colors.power,
        filters.is_barrier, colors.barrier,
        filters.is_watercourse, colors.water,
        ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], colors.highway_major_high_zoom,
        colors.highway_minor_high_zoom
      ]
    ],
    "line-opacity": [
      "case",
      ["all", filters.has_tunnel, filters.is_watercourse], 0.5,
      ["all", filters.has_subsurface_location, filters.is_power_line], 0.6,
      1
    ],
    "line-dasharray": [
      "case",
      filters.is_ferry, ["literal", [4, 4]],
      filters.has_intermittence, ["literal", [3, 2]],
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
      filters.is_building,
      filters.is_barrier,
      ["in", ["get", "amenity"], ["literal", ["parking"]]],
      ["in", ["get", "man_made"], ["literal", ["pier", "bridge"]]]
    ],
    "layout": {
      "fill-sort-key": [
        "case",
        filters.is_building, 30,
        filters.is_barrier, 20,
        ["in", ["get", "amenity"], ["literal", ["parking"]]], 10,
        0
      ]
    },
    "paint": {
      "fill-opacity": [
        "case",
        filters.is_building, 0.6,
        ["in", ["get", "man_made"], ["literal", ["bridge"]]], 0.4,
        ["in", ["get", "man_made"], ["literal", ["pier"]]], 0.6,
        1
      ],
      "fill-color": [
        "case",
        filters.is_building, colors.building,
        filters.is_barrier, colors.barrier,
        ["in", ["get", "amenity"], ["literal", ["parking"]]], colors.parking,
        ["in", ["get", "man_made"], ["literal", ["bridge"]]], colors.highway_casing,
        ["in", ["get", "man_made"], ["literal", ["pier"]]], colors.pier,
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

  const filledLanduseIds = ["aboriginal_lands", "developed", "park", "national_park", "military", "education", "station", "water", "maritime_park"];
  addLayer({
    "id": "landuse-fill",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "fill",
    "filter": [
      "any",
      ...filledLanduseIds.map(id => {
        if (id === "developed" || id === "water") {
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
        "case",
        ...filledLanduseIds.map(id => [filters['is_' + id], colors[id + '_fill']]).flat(),
        "red"
      ]
    }
  });

  addLayer({
      "id": "coastline",
      "source": "beefsteak",
      "source-layer": "line",
      "type": "line",
      "filter": [
          "all",
          ["==", ["get", "natural"], "coastline"],
          ["!", ["==", ["get", "maritime"], "yes"]
      ]],
      "layout": {
          "line-join": "round"
      },
      "paint": {
          "line-color": colors.water_outline,
          "line-width": 0.4
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

  let supportedTagLayers = ["-3","-2","-1","0","1","2","3"];
  supportedTagLayers.forEach(tagLayer => {
    addLayer(forTagLayer(structureLayer, tagLayer));
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
        "line-color": "#729A6A",
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

  const outlinedLanduseIds = ["aboriginal_lands", "park", "national_park", "military", "education", "station", "maritime_park"];
  addLayer({
    "id": "landuse-inset",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "line",
    "filter": [
      "any",
      ...outlinedLanduseIds.map(id => filters['is_' + id])
    ],
    "layout": {
      "line-join": "round",
      "line-sort-key": [
        "case",
        ...outlinedLanduseIds.map((id, i) => [filters['is_' + id], i]).flat(),
        0
      ]
    },
    "paint": {
      "line-opacity": 0.75,
      "line-color": [
        "case",
        ...outlinedLanduseIds.map(id => [filters['is_' + id], colors[id + '_fill']]).flat(),
        "red"
      ],
      "line-width": 3.6,
      "line-offset": 1.8
    },
    "minzoom": 12
  });

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
        ...outlinedLanduseIds.map(id => [filters['is_' + id], colors[id + '_outline']]).flat(),
        "red"
      ],
      "line-width": 0.4
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
            filters.is_watercourse, colors.water_text,
            "Black"
        ],
        "text-halo-color": "#fff",
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
        filters.is_maritime_park,
        filters.is_military,
        filters.is_national_park,
        filters.is_natural_area,
        filters.is_station
    ],
    "layout": {
        "symbol-placement": "point",
        "symbol-sort-key": ["-", ["coalesce", ["get", "c.area"], 0]],
        "text-size":[
            "case",
            filters.is_natural_area, 10,
            11
        ],
        "text-transform":[
            "case",
            [
                "all",
                ["in", ["get", "boundary"], ["literal", ["administrative"]]],
                ["in", ["get", "admin_level"], ["literal", ["2", "4"]]]
            ], "uppercase",
            filters.is_natural_area, "uppercase",
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
            filters.is_natural_area, ["literal", ["Noto Serif Medium Italic"]],
            ["literal", ["Noto Sans Medium"]]
        ],
        "text-letter-spacing":[
            "case",
            [
                "all",
                ["in", ["get", "boundary"], ["literal", ["administrative"]]],
                ["in", ["get", "admin_level"], ["literal", ["2", "4"]]]
            ], 0.15,
            filters.is_natural_area, 0.1,
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
            ], "#111",
            filters.is_water_area, colors.water_text,
            "#555"
        ],
        "text-halo-color": colors.background,
        "text-halo-width": 1
    }
  });

  return style;
}