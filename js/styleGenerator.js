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
  water: "#D4EEFF"
};

const lineCasingLayer = {
  "id": "line-casing",
  "source": "beefsteak",
  "source-layer": "line",
  "type": "line",
  "filter": [
    "any",
    ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]],
    ["in", ["get", "aeroway"], ["literal", ["runway", "taxiway"]]],
    ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link", "primary", "primary_link", "secondary", "secondary_link", "tertiary", "tertiary_link", "residential", "unclassified", "pedestrian", "living_street", "service", "track", "path", "footway", "steps", "cycleway", "bridleway", "corridor"]]],
    ["in", ["get", "waterway"], ["literal", ["river", "stream", "canal", "drain", "ditch", "tidal_channel", "fish_pass", "link"]]]
  ],
  "layout": {
      "line-join": "round",
      "line-cap": "butt"
  },
  "paint": {
      "line-opacity": [
          "case",
          ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]], 1,
          ["all", ["has", "bridge"], ["!", ["==", ["get", "bridge"], "no"]]], 0.4,
          1
      ],
      "line-width": [
          "interpolate", ["linear"], ["zoom"],
          14, [
              "case",
              ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]], 2.24,
              ["all", ["has", "bridge"], ["!", ["==", ["get", "bridge"], "no"]]], 10.75,
              ["in", ["get", "waterway"], ["literal", ["river", "stream", "canal", "drain", "ditch", "tidal_channel", "fish_pass", "link"]]], 2,
              3.75
          ],
          18, [
              "case",
              ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]], 3,
              ["all", ["has", "bridge"], ["!", ["==", ["get", "bridge"], "no"]]], [
                  "case",
                  ["in", ["get", "highway"], ["literal", ["path", "footway", "steps", "bridleway", "corridor"]]], 13,
                  ["in", ["get", "highway"], ["literal", ["service", "track", "cycleway"]]], 16,
                  ["in", ["get", "highway"], ["literal", ["motorway_link", "trunk", "trunk_link", "primary", "secondary", "tertiary"]]], 28,
                  ["any", ["in", ["get", "highway"], ["literal", ["motorway"]]], ["in", ["get", "aeroway"], ["literal", ["runway"]]]], 36,
                  21
              ],
              [
                  "case",
                  ["in", ["get", "waterway"], ["literal", ["stream", "drain", "ditch", "tidal_channel", "fish_pass", "link"]]], 3,
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
          ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]], colors.railway,
          colors.highway_casing
      ],
      "line-dasharray": [
          "case",
          ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]], ["literal", [0.4, 1.5]],
          [
              "any",
              [
                  "all",
                  ["!", ["has", "surface"]],
                  ["!", ["in", ["get", "highway"], ["literal", ["track", "path"]]]]
              ],
              ["in", ["get", "surface"], ["literal", ["asphalt", "paved", "paving_stones", "concrete", "wood", "metal", "sett", "bricks", "cobblestone"]]]
          ], ["literal", [1]],
          ["literal", [0.85, 1]]
      ]
  },
  "minzoom": 14
};

const lineLayer = {
  "id": "line",
  "source": "beefsteak",
  "source-layer": "line",
  "type": "line",
  "filter": [
    "any",
    ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]],
    ["in", ["get", "power"], ["literal", ["line", "minor_line", "cable"]]],
    ["in", ["get", "aeroway"], ["literal", ["runway", "taxiway"]]],
    ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link", "primary", "primary_link", "secondary", "secondary_link", "tertiary", "tertiary_link", "residential", "unclassified", "pedestrian", "living_street", "service", "track", "path", "footway", "steps", "cycleway", "bridleway", "corridor"]]],
    ["in", ["get", "waterway"], ["literal", ["river", "stream", "canal", "drain", "ditch", "tidal_channel", "fish_pass", "link"]]],
    ["any", ["has", "barrier"], ["in", ["get", "man_made"], ["literal", ["breakwater", "dyke", "groyne"]]], ["in", ["get", "waterway"], ["literal", ["dam", "weir"]]]]
  ],
  "layout": {
    "line-join": "round",
    "line-cap": "butt",
    "line-sort-key": [
      "case",
      ["in", ["get", "power"], ["literal", ["line", "minor_line", "cable"]]], 40,
      ["any", ["has", "barrier"], ["in", ["get", "man_made"], ["literal", ["breakwater", "dyke", "groyne"]]], ["in", ["get", "waterway"], ["literal", ["dam", "weir"]]]], 30,
      ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]], 20,
      ["in", ["get", "waterway"], ["literal", ["river", "stream", "canal", "drain", "ditch", "tidal_channel", "fish_pass", "link"]]], 10,
      ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], -10,
      0
    ]
  },
  "paint": {
    "line-width": [
      "interpolate", ["linear"], ["zoom"],
      14, [
        "case",
        ["in", ["get", "power"], ["literal", ["line", "minor_line", "cable"]]], 0.85,
        ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]], 0.8,
        ["all", ["has", "barrier"], ["!", ["any", ["in", ["get", "man_made"], ["literal", ["breakwater", "dyke", "groyne"]]], ["in", ["get", "waterway"], ["literal", ["dam", "weir"]]]]]], 1,
        ["in", ["get", "waterway"], ["literal", ["river", "stream", "canal", "drain", "ditch", "tidal_channel", "fish_pass", "link"]]], 2,
        1.75
      ],
      18, [
        "case",
        ["in", ["get", "power"], ["literal", ["line", "minor_line", "cable"]]], 0.85,
        ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]], 0.8,
        ["all", ["has", "barrier"], ["!", ["any", ["in", ["get", "man_made"], ["literal", ["breakwater", "dyke", "groyne"]]], ["in", ["get", "waterway"], ["literal", ["dam", "weir"]]]]]], 1.5,
        ["in", ["get", "highway"], ["literal", ["path", "footway", "steps", "bridleway", "corridor"]]], 4,
        ["in", ["get", "highway"], ["literal", ["service", "track", "cycleway"]]], 7,
        ["in", ["get", "highway"], ["literal", ["motorway_link", "trunk", "trunk_link", "primary", "secondary", "tertiary"]]], 19,
        ["any", ["in", ["get", "highway"], ["literal", ["motorway"]]], ["in", ["get", "aeroway"], ["literal", ["runway"]]]], 26,
        ["in", ["get", "waterway"], ["literal", ["stream", "drain", "ditch", "tidal_channel", "fish_pass", "link"]]], 6,
        ["in", ["get", "waterway"], ["literal", ["river", "canal"]]], 16,
        12
      ]
    ],
    "line-color": [
      "step", ["zoom"], [
        "case",
        ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]], colors.railway,
        ["in", ["get", "power"], ["literal", ["line", "minor_line", "cable"]]], colors.power,
        ["any", ["has", "barrier"], ["in", ["get", "man_made"], ["literal", ["breakwater", "dyke", "groyne"]]], ["in", ["get", "waterway"], ["literal", ["dam", "weir"]]]], colors.barrier,
        ["in", ["get", "waterway"], ["literal", ["river", "stream", "canal", "drain", "ditch", "tidal_channel", "fish_pass", "link"]]], colors.water,
        ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], colors.highway_major,
        colors.highway_minor
      ],
      14,  [
        "case",
        ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]], colors.railway,
        ["in", ["get", "power"], ["literal", ["line", "minor_line", "cable"]]], colors.power,
        ["any", ["has", "barrier"], ["in", ["get", "man_made"], ["literal", ["breakwater", "dyke", "groyne"]]], ["in", ["get", "waterway"], ["literal", ["dam", "weir"]]]], colors.barrier,
        ["in", ["get", "waterway"], ["literal", ["river", "stream", "canal", "drain", "ditch", "tidal_channel", "fish_pass", "link"]]], colors.water,
        ["in", ["get", "highway"], ["literal", ["motorway", "motorway_link", "trunk", "trunk_link"]]], colors.highway_major_high_zoom,
        colors.highway_minor_high_zoom
      ]
    ],
    "line-opacity": [
      "case",
      [
        "all",
        ["all", ["has", "tunnel"], ["!", ["==", ["get", "tunnel"], "no"]]],
        ["in", ["get", "waterway"], ["literal", ["river", "stream", "canal", "drain", "ditch", "tidal_channel", "fish_pass", "link"]]]
      ], 0.5,
      1
    ],
    "line-dasharray": [
      "case",
      ["==", ["get", "intermittent"], "yes"], ["literal", [3, 2]],
      ["literal", [1]]
    ]
  },
  "minzoom": 12
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
    } else if (tagLayer === '-2') {
      layerFilter = ["<=", ["to-number", ["get", "layer"], "0"], -2];
    } else if (tagLayer === '2') {
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

  let supportedTagLayers = ["-2","-1","0","1","2"];
  supportedTagLayers.forEach(tagLayer => {
    insertLayerBefore(forTagLayer(structureLayer, tagLayer), 'road-route');
    insertLayerBefore(forTagLayer(lineCasingLayer, tagLayer), 'road-route');
    insertLayerBefore(forTagLayer(lineLayer, tagLayer), 'road-route');
  });
  return style;
}