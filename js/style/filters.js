export const filters = {
  has_bridge: [
    "all",
    ["has", "bridge"],
    ["!", ["==", ["get", "bridge"], "no"]]
  ],
  has_elevation: ["has", "ele"],
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
  is_building_part: ["has", "building:part"],
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
    ["has", "r.route"],
    [
      "any",
      ["in", "hiking", ["split", ["get", "r.route"], "┃"]],
      ["in", "foot", ["split", ["get", "r.route"], "┃"]],
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
  is_amusement: [
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
    ["in", ["get", "natural"], ["literal", ["desert", "gorge", "massif", "mountain_range", "peninsula", "valley", "volcano"]]]
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
  is_peak: ["==", ["get", "natural"], "peak"],
  is_power: ["in", ["get", "power"], ["literal", ["plant", "substation"]]],
  is_powerline: ["in", ["get", "power"], ["literal", ["line", "minor_line", "cable"]]],
  is_minor_power_support:  ["in", ["get", "power"], ["literal", ["pole"]]],
  is_major_power_support:  ["in", ["get", "power"], ["literal", ["catenary_mast", "portal", "tower"]]],
  is_railway: ["in", ["get", "railway"], ["literal", ["rail", "subway", "narrow_gauge", "light_rail", "miniature", "tram", "monorail"]]],
  is_religious: [
    "all",
    ["!", ["has", "building"]],
    ["!", ["all", ["has", "indoor"], ["!", ["==", ["get", "indoor"], "no"]]]],
    [
      "any",
      ["in", ["get", "amenity"], ["literal", ["place_of_worship", "monastery", "grave_yard"]]],
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
  is_survey_point: ["==", ["get", "man_made"], "survey_point"],
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
  is_water_surface_intermittent: [
    "all",
    ["==", ["get", "intermittent"], "yes"],
    ["==", ["get", "natural"], "water"],
    ["<=", ["to-number", ["get", "layer"], "0"], 0]
  ],
  is_watercourse: ["in", ["get", "waterway"], ["literal", ["canal", "ditch", "drain", "fish_pass", "river", "stream", "tidal_channel"]]],
  is_waterway_network_edge: ["in", ["get", "waterway"], ["literal", ["canal", "ditch", "drain", "fairway", "fish_pass", "flowline", "link", "river", "stream", "tidal_channel"]]],
  is_flowline: ["==", ["get", "waterway"], "flowline"],
  is_waterfall: ["==", ["get", "waterway"], "waterfall"],
};