import { filters } from "./filters.js";
import { colors } from "./colors.js";

export const landuses = [
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
    filter: filters.is_amusement,
    fill_color: colors.amusement_fill,
    outline_color: colors.amusement_outline,
    text_color: colors.amusement_text
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
    filter: filters.is_water_surface_intermittent,
    fill_color: colors.intermittent_water_fill,
    outline_color: colors.water_outline,
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