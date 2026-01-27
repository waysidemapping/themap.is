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
  "free_stuff",
  "gambling",
  "healthcare",
  "lodging",
  "mail",
  "stores",
  "street_furniture"
];

const featureDefaultsByGroup = {
  amenity: {
    iconOpts: { 
      bg_fill: colors.education_icon,
      fill: colors.text_halo
    }
  },
  amusement: {
    iconOpts: { 
      bg_fill: colors.amusement_icon,
      fill: colors.text_halo
    }
  },
  bathing_water: {
    iconOpts: { 
      bg_fill: colors.swimming_pool_icon,
      fill: colors.text_halo
    }
  },
  education: {
    iconOpts: { 
      bg_fill: colors.education_icon,
      fill: colors.text_halo
    }
  },
  food: {
    iconOpts: { 
      bg_fill: colors.food_icon,
      fill: colors.text_halo
    }
  },
  healthcare: {
    iconOpts: { 
      bg_fill: colors.healthcare_icon,
      fill: colors.text_halo
    }
  },
  ice: {
    iconOpts: { 
      bg_fill: colors.ice_text,
      fill: colors.text_halo
    }
  },
  lodging: {
    iconOpts: { 
      bg_fill: colors.education_icon,
      fill: colors.text_halo
    }
  },
  adult_amusement: {
    iconOpts: { 
      bg_fill: "#33145e",
      fill: colors.text_halo
    }
  },
  parks: {
    iconOpts: { 
      bg_fill: colors.park_icon,
      fill: colors.text_halo
    }
  },
  stores: {
    iconOpts: { 
      bg_fill: colors.shop_icon,
      fill: colors.text_halo
    }
  },
  sports: {
    iconOpts: { 
      bg_fill: colors.outdoor_sports_facility_icon,
      fill: colors.text_halo
    }
  },
  transport: {
    iconOpts: { 
      bg_fill: colors.station_icon,
      fill: colors.text_halo
    }
  },
  water: {
    iconOpts: { 
      bg_fill: colors.water_text,
      fill: colors.text_halo
    }
  }
};

async function loadData() {
  const presetsById = await fetch('/dist/presets.json').then(response => response.json());
  groupThemes.forEach(group => themesById[group] = {features: [{presetGroups: [group]}]});
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
                expandedFeatures.push(feature);
              });
         // }
        }
      }
    }
    theme.features = expandedFeatures;

    for (let i in theme.features) {
      let feature = theme.features[i];
      if (!feature.icon) feature.icon = 'dot';
      if (!feature.iconOpts) feature.iconOpts = {
        bg_fill: colors.text,
        fill: colors.text_halo
      };
      if (feature.groups) {
        let groupDefaults = feature.groups.map(group => featureDefaultsByGroup[group]).filter(Boolean).at(0);
        if (groupDefaults) {
          if (groupDefaults.iconOpts) {
            Object.assign(feature.iconOpts, groupDefaults.iconOpts);
          }
        }
      }
      // if (feature.class !== 'minor') {
      //   feature.iconOpts.bg_fill = feature.iconOpts.fill;
      //   feature.iconOpts.fill = colors.text_halo;
      //   delete feature.iconOpts.halo;
      // }
    }
    if (!theme.primaryColor) {
      theme.primaryColor = theme.features.map(feature => [feature.iconOpts?.bg_fill, feature.iconOpts?.fill]).flat().filter(Boolean).at(0);
    }
  }
  return themesById;
}

export const themesPromise = loadData();