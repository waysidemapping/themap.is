import { colors } from './colors.js';

const themesById = {
  "bars_and_restaurants": {
    features: [
      {
        presets: [
          "amenity/bar",
          "amenity/restaurant"
        ]
      }
    ]
  },
  "books": {
    features: [
      {
        presets: ["amenity/library"]
      },
      {
        presets: ["amenity/public_bookcase"]
      },
      {
        presets: ["shop/books"]
      }
    ]
  },
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
  "gambling": {
    features: [
      {
        presets: [
          "amenity/casino",
          "leisure/adult_gaming_centre",
          "shop/bookmaker",
          "shop/lottery"
        ]
      },
    ]
  },
  "nightlife": {
    features: [
      {
        presets: [
          "amenity/nightclub",
          "amenity/bar",
          "amenity/pub"
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

const featureDefaultsByGroup = {
  amenity: {
    iconOpts: { 
      bg_fill: colors.education_icon,
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
  ice: {
    iconOpts: { 
      bg_fill: colors.ice_text,
      fill: colors.text_halo
    }
  },
  nightlife: {
    iconOpts: { 
      bg_fill: "#33145e",
      fill: colors.text_halo
    }
  },
  shop: {
    iconOpts: { 
      bg_fill: colors.shop_icon,
      fill: colors.text_halo
    }
  },
  transport: {
    iconOpts: { 
      bg_fill: colors.station_text,
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
  for (let presetId in presetsById) {
    let preset = presetsById[presetId];
    if (preset.plural) {
      // id normalization needs to match those in 404.html
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