import { colors } from './colors.js';

export const themes = {
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
          "amenity/bar",
          "amenity/nightclub",
          "amenity/pub"
        ]
      }
    ]
  },
  "swimming": {
    features: [
      {
        presets: ["leisure/sports_centre/swimming"]
      },
      {
        presets: ["leisure/swimming_pool"]
      }
    ]
  }
};

const featureDefaultsByGroup = {
  amenity: {
    fill_color: colors.education_fill,
    outline_color: colors.education_outline,
    text_color: colors.education_text,
    icon_color: colors.education_icon
  },
  bathing_water: {
    fill_color: colors.swimming_pool_fill,
    outline_color: colors.swimming_pool_outline,
    text_color: colors.swimming_pool_text,
    icon_color: colors.swimming_pool_icon
  },
  education: {
    fill_color: colors.education_fill,
    outline_color: colors.education_outline,
    text_color: colors.education_text,
    icon_color: colors.education_icon
  },
  ice: {
    fill_color: colors.ice_fill,
    outline_color: colors.ice_outline,
    text_color: colors.ice_text
  },
  nightlife: {
    text_color: "#33145e"
  },
  shop: {
    icon_color: colors.shop_icon
  },
  transport: {
    fill_color: colors.station_fill,
    outline_color: colors.station_outline,
    text_color: colors.station_text
  },
  water: {
    fill_color: colors.water_fill,
    outline_color: colors.water_outline,
    text_color: colors.water_text
  }
};

async function loadData() {
  const presetsById = await fetch('/dist/presets.json').then(response => response.json());

  for (let presetId in presetsById) {
    let preset = presetsById[presetId];
    if (preset.plural) {
      let themeId = preset.plural.replaceAll(' ', '_').toLowerCase();
      if (!themes[themeId]) {
        themes[themeId] = {
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

  for (let id in themes) {
    let theme = themes[id];
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
        feature.iconOpts = {
          fill: colors.text,
          halo: colors.text_halo
        };
        if (feature.groups) {
          let groupDefaults = feature.groups.map(group => featureDefaultsByGroup[group]).filter(Boolean).at(0);
          let fill = groupDefaults?.icon_color || groupDefaults?.text_color;
          if (fill) {
            feature.iconOpts.fill = fill;
          }
        }
        // if (feature.class !== 'minor') {
        //   feature.iconOpts.bg_fill = feature.iconOpts.fill;
        //   feature.iconOpts.fill = colors.text_halo;
        //   delete feature.iconOpts.halo;
        // }
      }
    }
  }
}

await loadData();