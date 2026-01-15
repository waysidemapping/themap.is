const filters = {
  aboriginal_lands: ["==", ["get", "boundary"], "aboriginal_lands"],
  developed: ["in", ["get", "landuse"], ["literal", ["residential", "commercial", "industrial", "retail", "brownfield", "garages", "railway"]]],
  education: [
      "all",
      ["!", ["has", "building"]],
      [
          "any",
          ["has", "education"],
          ["in", ["get", "amenity"], ["literal", ["school", "college", "university"]]],
          ["in", ["get", "landuse"], ["literal", ["education"]]]
      ]
  ],
  has_bridge: ["all", ["has", "bridge"], ["!", ["==", ["get", "bridge"], "no"]]],
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
  has_tunnel: ["all", ["has", "tunnel"], ["!", ["==", ["get", "tunnel"], "no"]]],
  is_aeroway: ["in", ["get", "aeroway"], ["literal", ["runway", "taxiway"]]],
  is_barrier: ["any", ["has", "barrier"], ["in", ["get", "man_made"], ["literal", ["breakwater", "dyke", "groyne"]]], ["in", ["get", "waterway"], ["literal", ["dam", "weir"]]]],
  is_minor_barrier: ["all", ["has", "barrier"], ["!", ["any", ["in", ["get", "man_made"], ["literal", ["breakwater", "dyke", "groyne"]]], ["in", ["get", "waterway"], ["literal", ["dam", "weir"]]]]]],
  is_highway: ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link", "primary", "primary_link", "secondary", "secondary_link", "tertiary", "tertiary_link", "residential", "unclassified", "pedestrian", "living_street", "service", "track", "path", "footway", "steps", "cycleway", "bridleway", "corridor"]]],
  is_powerline: ["in", ["get", "power"], ["literal", ["line", "minor_line", "cable"]]],
  is_traintrack: ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]],
  is_watercourse: ["in", ["get", "waterway"], ["literal", ["canal", "ditch", "drain", "fish_pass", "flowline", "link", "river", "stream", "tidal_channel"]]],
  maritime_park: [
    "all",
    [
      "any",
      ["==", ["get", "boundary"], "protected_area"],
      ["in", ["get", "leisure"], ["literal", ["nature_reserve", "park"]]]
    ],
    ["==", ["get", "maritime"], "yes"]
  ],
  military: [
    "any",
    ["==", ["get", "landuse"], "military"],
    ["==", ["get", "military"], "base"]
  ],
  national_park: [
    "all",
    ["==", ["get", "boundary"], "protected_area"],
    ["==", ["get", "protected_area"], "national_park"],
    ["!", ["==", ["get", "maritime"], "yes"]]
  ],
  park: [
    "all",
    [
      "any",
      ["==", ["get", "boundary"], "protected_area"],
      ["in", ["get", "leisure"], ["literal", ["nature_reserve", "park"]]]
    ],
    ["!", ["==", ["get", "protected_area"], "national_park"]],
    ["!", ["==", ["get", "maritime"], "yes"]]
  ],
  station: [
    "all",
    ["!", ["has", "building"]],
    [
        "any",
        ["==", ["get", "public_transport"], "station"],
        ["==", ["get", "aeroway"], "aerodrome"],
        ["==", ["get", "railway"], "station"]
    ]
  ],
  water: [
    "any",
    ["in", ["get", "natural"], ["literal", ["coastline", "water"]]],
    ["in", ["get", "leisure"], ["literal", ["swimming_pool"]]]
  ]
};

const colors = {
  barrier: "#D6CCCF",
  building: "#807974",
  parking: "#f0f0f0",
  pier: "#fff",
  power: "#D4BADE",
  highway_major: "#F7CF8D",
  highway_major_high_zoom: "#FFF2DD",
  highway_minor: "#cfcfcf",
  highway_minor_high_zoom: "#fff",
  highway_casing: "#d0d0d0",
  railway: "#969CAC",
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
  water_outline: "#BFD3E0"
};

const lineCasingLayer = {
  "id": "line-casing",
  "source": "beefsteak",
  "source-layer": "line",
  "type": "line",
  "filter": [
    "any",
    ["all", ["<", ["zoom"], 12], filters.is_powerline, ["!", filters.has_subsurface_location]],
    filters.is_traintrack,
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
      filters.is_traintrack, 1,
      filters.has_bridge, 0.4,
      1
    ],
    "line-width": [
      "interpolate", ["linear"], ["zoom"],
      14, [
        "case",
        filters.is_powerline, 1.9,
        filters.is_traintrack, 2.25,
        filters.has_bridge, 10.75,
        filters.is_watercourse, 2,
        3.75
      ],
      18, [
        "case",
        filters.is_powerline, 1.9,
        filters.is_traintrack, 3,
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
      filters.is_powerline, colors.power,
      filters.is_traintrack, colors.railway,
      colors.highway_casing
    ],
    "line-dasharray": [
      "case",
      filters.is_powerline, ["literal", [1, 8]],
      filters.is_traintrack, ["literal", [0.4, 1.5]],
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
    filters.is_traintrack,
    filters.is_powerline,
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
      filters.is_powerline, 40,
      filters.is_barrier, 30,
      filters.is_traintrack, 20,
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
        filters.is_powerline, [
          "case", filters.has_subsurface_location, 1.85,
          0.85
        ],
        filters.is_traintrack, 0.8,
        filters.is_minor_barrier, 1,
        filters.is_watercourse, 2,
        1.75
      ],
      18, [
        "case",
        filters.is_powerline, [
          "case", filters.has_subsurface_location, 1.85,
          0.85
        ],
        filters.is_traintrack, 0.8,
        filters.is_minor_barrier, 1.5,
        ["in", ["get", "highway"], ["literal", ["path", "footway", "steps", "bridleway", "corridor"]]], 4,
        ["in", ["get", "highway"], ["literal", ["service", "track", "cycleway"]]], 7,
        ["in", ["get", "highway"], ["literal", ["motorway_link", "trunk", "trunk_link", "primary", "secondary", "tertiary"]]], 19,
        ["any", ["in", ["get", "highway"], ["literal", ["motorway"]]], ["in", ["get", "aeroway"], ["literal", ["runway"]]]], 26,
        ["in", ["get", "waterway"], ["literal", ["stream", "drain", "ditch", "tidal_channel", "fish_pass", "flowline",  "link"]]], 6,
        ["in", ["get", "waterway"], ["literal", ["river", "canal"]]], 16,
        12
      ]
    ],
    "line-color": [
      "step", ["zoom"], [
        "case",
        filters.is_traintrack, colors.railway,
        filters.is_powerline, colors.power,
        filters.is_barrier, colors.barrier,
        filters.is_watercourse, colors.water,
        ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], colors.highway_major,
        colors.highway_minor
      ],
      14,  [
        "case",
        filters.is_traintrack, colors.railway,
        filters.is_powerline, colors.power,
        filters.is_barrier, colors.barrier,
        filters.is_watercourse, colors.water,
        ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], colors.highway_major_high_zoom,
        colors.highway_minor_high_zoom
      ]
    ],
    "line-opacity": [
      "case",
      ["all", filters.has_tunnel, filters.is_watercourse], 0.5,
      ["all", filters.has_subsurface_location, filters.is_powerline], 0.6,
      1
    ],
    "line-dasharray": [
      "case",
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
      ["has", "building"],
      ["in", ["get", "man_made"], ["literal", ["pier", "bridge"]]],
      ["in", ["get", "amenity"], ["literal", ["parking"]]]
    ],
    "layout": {
      "fill-sort-key": [
        "case",
        ["has", "building"], 2,
        ["in", ["get", "amenity"], ["literal", ["parking"]]], 1,
        0
      ]
    },
    "paint": {
      "fill-opacity": [
        "case",
        ["has", "building"], 0.6,
        ["in", ["get", "man_made"], ["literal", ["bridge"]]], 0.4,
        ["in", ["get", "man_made"], ["literal", ["pier"]]], 0.6,
        1
      ],
      "fill-color": [
        "case",
        ["has", "building"], colors.building,
        ["in", ["get", "man_made"], ["literal", ["bridge"]]], colors.highway_casing,
        ["in", ["get", "man_made"], ["literal", ["pier"]]], colors.pier,
        colors.parking
      ]
    }
};

export function generateStyle(baseStyleJsonString) {

  // parse anew every time to avoid object references
  const style = JSON.parse(baseStyleJsonString);

  function insertLayerBefore(layer, id) {
    let index = style.layers.findIndex(layer => layer.id === id);
    style.layers.splice(index, 0, layer);
  }

  const filledLanduseIds = ["aboriginal_lands", "developed", "park", "national_park", "military", "education", "station", "water", "maritime_park"];
  insertLayerBefore({
    "id": "landuse-fill",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "fill",
    "filter": [
      "any",
      ...filledLanduseIds.map(id => {
        if (id === "developed" || id === "water") {
          return filters[id];
        }
        return [
          "all",
          ["<", ["zoom"], 12],
          filters[id]
        ]
      })
    ],
    "layout": {
      "fill-sort-key": [
        "case",
        ...filledLanduseIds.map((id, i) => [filters[id], i]).flat(),
        0
      ]
    },
    "paint": {
      "fill-color": [
        "case",
        ...filledLanduseIds.map(id => [filters[id], colors[id + '_fill']]).flat(),
        "red"
      ]
    }
  }, 'barrier-fill');
  
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
    insertLayerBefore(forTagLayer(structureLayer, tagLayer), 'road-route');
    insertLayerBefore(forTagLayer(lineCasingLayer, tagLayer), 'road-route');
    insertLayerBefore(forTagLayer(lineLayer, tagLayer), 'road-route');
  });

  const outlinedLanduseIds = ["aboriginal_lands", "park", "national_park", "military", "education", "station", "maritime_park"];
  insertLayerBefore({
    "id": "landuse-inset",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "line",
    "filter": [
      "any",
      ...outlinedLanduseIds.map(id => filters[id])
    ],
    "layout": {
      "line-join": "round",
      "line-sort-key": [
        "case",
        ...outlinedLanduseIds.map((id, i) => [filters[id], i]).flat(),
        0
      ]
    },
    "paint": {
      "line-opacity": 0.75,
      "line-color": [
        "case",
        ...outlinedLanduseIds.map(id => [filters[id], colors[id + '_fill']]).flat(),
        "red"
      ],
      "line-width": 3.6,
      "line-offset": 1.8
    },
    "minzoom": 12
  }, 'boundary-casing');

  insertLayerBefore({
    "id": "landuse-outline",
    "source": "beefsteak",
    "source-layer": "area",
    "type": "line",
    "layout": {
      "line-sort-key": [
        "case",
        ...outlinedLanduseIds.map((id, i) => [filters[id], i]).flat(),
        0
      ]
    },
    "filter": [
      "any",
      ...outlinedLanduseIds.map(id => filters[id])
    ],
    "paint": {
      "line-color": [
        "case",
        ...outlinedLanduseIds.map(id => [filters[id], colors[id + '_outline']]).flat(),
        "red"
      ],
      "line-width": 0.4
    }
  }, 'boundary-casing');

  return style;
}