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
      fill: colors.education_icon
    }
  },
  bathing_water: {
    iconOpts: { 
      fill: colors.swimming_pool_icon
    }
  },
  education: {
    iconOpts: { 
      fill: colors.education_icon
    }
  },
  food: {
    iconOpts: { 
      fill: colors.food_icon
    }
  },
  ice: {
    iconOpts: { 
      fill: colors.ice_text
    }
  },
  nightlife: {
    iconOpts: { 
      fill: "#33145e"
    }
  },
  shop: {
    iconOpts: { 
      fill: colors.shop_icon
    }
  },
  transport: {
    iconOpts: { 
      fill: colors.station_text
    }
  },
  water: {
    iconOpts: { 
      fill: colors.water_text
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
      if (feature.icon) {
        if (!feature.iconOpts) feature.iconOpts = {
          fill: colors.text,
          halo: colors.text_halo
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
    }
    if (!theme.primaryColor) {
      theme.primaryColor = theme.features.map(feature => [feature.iconOpts?.bg_fill, feature.iconOpts?.fill]).flat().filter(Boolean).at(0);
    }
  }
  return themesById;
}

export const themes = await loadData();