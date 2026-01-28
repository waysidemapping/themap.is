import { colors } from './colors.js';

const themesById = {
  "eats": {
    features: [
      {
        presets: [
          "amenity/fast_food",
          "amenity/food_court",
          "amenity/cafe",
          "amenity/ice_cream",
          "amenity/pub",
          "amenity/restaurant"
        ]
      }
    ]
  },
  "swimming": {
    features: [
      {
        presets: ["leisure/swimming_pool"]
      },
      {
        presets: ["leisure/sports_centre/swimming"]
      }
    ]
  }
};

let groupThemes = [
  "bees",
  "books",
  "dams",
  "islands",
  "free stuff",
  "gambling",
  "healthcare",
  "lodging",
  "mail",
  "maps",
  "motorcycles",
  "stores",
  "street furniture",
  "vehicle rental",
  "vehicle repair shops",
  "waterway access"
];

const featureDefaultsByGroup = {
  amenity: {
    icon: { 
      bg_fill: colors.education_icon,
      fill: colors.text_halo
    }
  },
  amusement: {
    icon: { 
      bg_fill: colors.amusement_icon,
      fill: colors.text_halo
    }
  },
  bathing_water: {
    icon: { 
      bg_fill: colors.swimming_pool_icon,
      fill: colors.text_halo
    }
  },
  education: {
    icon: { 
      bg_fill: colors.education_icon,
      fill: colors.text_halo
    }
  },
  food: {
    icon: { 
      bg_fill: colors.food_icon,
      fill: colors.text_halo
    }
  },
  healthcare: {
    icon: { 
      bg_fill: colors.healthcare_icon,
      fill: colors.text_halo
    }
  },
  ice: {
    icon: { 
      bg_fill: colors.ice_text,
      fill: colors.text_halo
    }
  },
  lodging: {
    icon: { 
      bg_fill: colors.education_icon,
      fill: colors.text_halo
    }
  },
  adult_amusement: {
    icon: { 
      bg_fill: "#33145e",
      fill: colors.text_halo
    }
  },
  parks: {
    icon: { 
      bg_fill: colors.park_icon,
      fill: colors.text_halo
    }
  },
  stores: {
    icon: { 
      bg_fill: colors.shop_icon,
      fill: colors.text_halo
    }
  },
  sports: {
    icon: { 
      bg_fill: colors.outdoor_sports_facility_icon,
      fill: colors.text_halo
    }
  },
  transport: {
    icon: { 
      bg_fill: colors.station_icon,
      fill: colors.text_halo
    }
  },
  water: {
    icon: { 
      bg_fill: colors.water_text,
      fill: colors.text_halo
    }
  }
};

async function loadData() {
  const presetsById = await fetch('/dist/presets.json').then(response => response.json());
  groupThemes.forEach(group => themesById[group.replaceAll(' ', '_')] = {features: [{presetGroups: [group]}]});
  for (let presetId in presetsById) {
    let preset = presetsById[presetId];
    preset.id = presetId;
    if (preset.plural && preset.autoTheme !== false) {
      // id normalization needs to match those in urlController.js
      let themeId = preset.plural
        .replaceAll(' ', '_')
        .toLowerCase()
        // strip diacritics
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      if (!themesById[themeId]) {
        themesById[themeId] = {
          name: preset.plural,
          features: [
            {
              presets: [presetId]
            }
          ]
        };
      }
    }
  }
  for (let presetId in presetsById) {
    if (!presetsById[presetId].icon) {
      const parentIdForIcon = presetsById[presetId].parents?.find(parentId => presetsById[parentId].icon);
      if (parentIdForIcon) presetsById[presetId].icon = presetsById[parentIdForIcon].icon;
    }
  }

  for (let id in themesById) {
    let theme = themesById[id];
    theme.id = id;
    if (!theme.name) theme.name = theme.id.replaceAll('_', ' ');
    theme.searchName = theme.name.toLowerCase()
      // strip diacritics
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let expandedFeatures = [];
    for (let i in theme.features) {
      if (theme.features[i].presetGroups) {
        let presets = Object.values(presetsById).filter(preset => preset.groups?.some(group => theme.features[i].presetGroups.includes(group)))
        theme.features[i].presets = presets.map(preset => preset.id);
      }
      if (theme.features[i].presets) {
        for (let j in theme.features[i].presets) {
          let presetId = theme.features[i].presets[j];
          //if (presetId.endsWith('/')) {
            Object.keys(presetsById)
              .filter(id => id === presetId || id.startsWith(presetId + '/'))
              .map(id => presetsById[id])
              .sort((a, b) => (b.parents?.length || 0) - (a.parents?.length || 0))
              .forEach(preset => {
                let feature = {};
                Object.assign(feature, theme.features[i]);
                Object.assign(feature, preset);
                if (typeof feature.icon === 'string') {
                  feature.icon = { file: feature.icon };
                }
                expandedFeatures.push(feature);
              });
         // }
        }
      }
    }
    theme.features = expandedFeatures;

    for (let i in theme.features) {
      let feature = theme.features[i];
      if (!feature.icon) feature.icon = {};
      if (!feature.icon.bg_fill) feature.icon.bg_fill = colors.text;
      if (!feature.icon.fill) feature.icon.fill = colors.text_halo;
      if (feature.groups) {
        let groupDefaults = feature.groups.map(group => featureDefaultsByGroup[group]).filter(Boolean).at(0);
        if (groupDefaults) {
          if (groupDefaults.icon) {
            Object.assign(feature.icon, groupDefaults.icon);
          }
        }
      }

      // if (feature.class !== 'minor') {
      //   feature.icon.bg_fill = feature.icon.fill;
      //   feature.icon.fill = colors.text_halo;
      //   delete feature.icon.halo;
      // }
    }
    let sortedFeatures = theme.features.toSorted((a, b) => (a.parents?.length || 0) - (b.parents?.length || 0))
    if (!theme.iconFile) {
      theme.iconFile = sortedFeatures.find(feature => feature.icon?.file)?.icon?.file;
    }
    if (!theme.primaryColor) {
      theme.primaryColor = sortedFeatures.map(feature => feature.icon?.bg_fill || feature.icon?.fill).filter(Boolean).at(0);
    }
  }
  return themesById;
}

export const themesPromise = loadData();