import { filters } from "./filters.js";

export const lineLayerLineWidthExpression = [
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