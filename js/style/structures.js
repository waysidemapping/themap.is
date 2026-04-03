import { filters } from "./filters.js";
import { colors } from "./colors.js";

export function getStructures(opts) {

  const structures = [
    {
      filter: filters.is_water_surface_intermittent,
      fill_color: colors.intermittent_water_fill,
      outline_color: colors.water_outline
    },
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
    }
  ];

  if (!opts.render3d) {
    structures.push({
      filter: filters.is_building,
      fill_color: colors.building_fill,
      fill_opacity: 0.5
    });
  }
  return structures;
}