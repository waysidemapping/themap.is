import { colors } from './colors.js';
import chroma from './../node_modules/chroma-js/index.js';

const featureDefaultsByGroup = {
  aboriginal_lands: {
    iconInfo: { 
      bg_fill: colors.aboriginal_lands_icon,
      fill: colors.text_halo
    }
  },
  adult_amusement: {
    iconInfo: { 
      bg_fill: "#33145e",
      fill: colors.text_halo
    }
  },
  amusement: {
    iconInfo: { 
      bg_fill: colors.amusement_icon,
      fill: colors.text_halo
    }
  },
  barriers: {
    iconInfo: { 
      bg_fill: colors.barrier_icon,
      fill: colors.text_halo
    }
  },
  bathing_water: {
    iconInfo: { 
      bg_fill: colors.swimming_pool_icon,
      fill: colors.text_halo
    }
  },
  craft: {
    iconInfo: { 
      bg_fill: colors.craft_icon,
      fill: colors.text_halo
    }
  },
  education: {
    iconInfo: { 
      bg_fill: colors.education_icon,
      fill: colors.text_halo
    }
  },
  food: {
    iconInfo: { 
      bg_fill: colors.food_icon,
      fill: colors.text_halo
    }
  },
  healthcare: {
    iconInfo: { 
      bg_fill: colors.healthcare_icon,
      fill: colors.text_halo
    }
  },
  ice: {
    iconInfo: { 
      bg_fill: colors.ice_text,
      fill: colors.text_halo
    }
  },
  indoor_lodging: {
    iconInfo: { 
      bg_fill: colors.indoor_lodging_icon,
      fill: colors.text_halo
    }
  },
  offices: {
    iconInfo: { 
      bg_fill: colors.office_icon,
      fill: colors.text_halo
    }
  },
  outdoor_recreation: {
    iconInfo: { 
      bg_fill: colors.outdoor_recreation_icon,
      fill: colors.text_halo
    }
  },
  parks: {
    iconInfo: { 
      bg_fill: colors.park_icon,
      fill: colors.text_halo
    }
  },
  plants: {
    iconInfo: { 
      bg_fill: colors.plants_icon,
      fill: colors.text_halo
    }
  },
  power: {
    iconInfo: { 
      bg_fill: colors.power_icon,
      fill: colors.text_halo
    }
  },
  religious: {
    iconInfo: { 
      bg_fill: colors.religious_icon,
      fill: colors.text_halo
    }
  },
  sports: {
    iconInfo: { 
      bg_fill: colors.outdoor_sports_facility_icon,
      fill: colors.text_halo
    }
  },
  stores: {
    iconInfo: { 
      bg_fill: colors.shop_icon,
      fill: colors.text_halo
    }
  },
  transport: {
    iconInfo: { 
      bg_fill: colors.station_icon,
      fill: colors.text_halo
    }
  },
  water: {
    iconInfo: { 
      bg_fill: colors.water_text,
      fill: colors.text_halo
    }
  },
  hazard: {
    disallowedAccessIconInfo: { 
      bg_fill: colors.hazard_icon,
      fill: colors.text_halo
    }
  }
};

// Collapse down features referencing foreign themes, e.g. {"themes": ["brazilian_cuisine"]}
function resolveForeignThemeReferences(themesById) {
  while (Object.values(themesById).some(theme => theme.features.some(feature => feature.themes))) {
    for (const id in themesById) {
      const theme = themesById[id];
      const expandedFeatures = [];
      for (const i in theme.features) {
        const feature = theme.features[i];
        if (feature.themes) {
          for (const j in feature.themes) {
            const foreignThemeId = feature.themes[j];
            if (!themesById[foreignThemeId]) {
              console.error(`Missing expected theme: ${foreignThemeId}`);
            }
            const foreignTheme = themesById[foreignThemeId];
            for (const k in foreignTheme.features) {
              const expandedFeature = {};
              const foreignThemeFeature = foreignTheme.features[k];
              Object.assign(expandedFeature, foreignThemeFeature);
              Object.assign(expandedFeature, feature);
              expandedFeature.themes = foreignThemeFeature.themes;
              expandedFeatures.push(expandedFeature);
            }
          }
        } else {
          expandedFeatures.push(theme.features[i]);
        }
      }
      theme.features = expandedFeatures;
    }
  }
  return themesById;
}

function resolvePresetReferences(themesById, presetsById) {
  const presetIdsByTag = {};
  for (const presetId in presetsById) {
    const preset = presetsById[presetId];
    for (const key in preset.tags) {
      const tagString = key + '=' + preset.tags[key];
      if (!presetIdsByTag[tagString]) presetIdsByTag[tagString] = [];
      presetIdsByTag[tagString].push(presetId);
    }
  }

  for (const id in themesById) {
    const theme = themesById[id];
    theme.features = getExpandedFeatures(theme);
  }
  return themesById;

  function getExpandedFeatures(theme) {
    let expandedFeatures = [];
    for (const i in theme.features) {

      if (!theme.features[i].presets && theme.features[i].tags) {
        let presetsMatchingAllTags = null;
        for (const key in theme.features[i].tags) {
          const tagString = key + '=' +  theme.features[i].tags[key];
          const presetsMatchingThisTag = presetIdsByTag[tagString] || [];
          if (!presetsMatchingAllTags) {
            presetsMatchingAllTags = presetsMatchingThisTag;
          } else {
            presetsMatchingAllTags = presetsMatchingAllTags.filter(presetId => presetsMatchingThisTag.includes(presetId));
          }
        }
        if (presetsMatchingAllTags.length) {
          theme.features[i].presets = presetsMatchingAllTags;
        }
      }

      if (theme.features[i].presets) {
        for (const j in theme.features[i].presets) {
          const presetId = theme.features[i].presets[j];
          //if (presetId.endsWith('/')) {
            Object.keys(presetsById)
              .filter(id => id === presetId || id.startsWith(presetId + '/'))
              .map(id => presetsById[id])
              .sort((a, b) => (b.parents?.length || 0) - (a.parents?.length || 0))
              .forEach(preset => {
                let feature = {};
                Object.assign(feature, preset);
                Object.assign(feature, theme.features[i]);
                delete feature.presets;
                expandedFeatures.push(feature);
              });
        // }
        }
      }
      if (theme.features[i].tags) {
        // always include the tags at the end even if we matched them to a preset, assuming the tags are more generalized
        expandedFeatures.push(theme.features[i]);
      }
    }
    return expandedFeatures;
  }
}

function loadDefaultThemeProperties(themesById) {

  for (const themeId in themesById) {
    const theme = themesById[themeId];
    for (const i in theme.features) {
      const feature = theme.features[i];
      loadGroupDefaults(feature);
      loadIconDefaults(feature);
    }
    loadThemeDefaults(theme);
  }
  return themesById;

  function loadThemeDefaults(theme) {
    if (!theme.groupType) theme.groupType = 'theme';

    const sortedFeatures = theme.features.toSorted((a, b) => (a.parents?.length || 0) - (b.parents?.length || 0))
    if (!theme.icon) {
      theme.icon = sortedFeatures.find(feature => feature.iconInfo?.file)?.iconInfo?.file;
    }
    if (!theme.primaryColor) {
      theme.primaryColor = sortedFeatures.map(feature => feature.iconInfo?.bg_fill || feature.iconInfo?.fill).filter(Boolean).at(0);
    }
  }

  function loadGroupDefaults(feature) {
    if (feature.groups) {
      const groupDefaults = feature.groups.map(group => featureDefaultsByGroup[group]).filter(Boolean);
      for (const i in groupDefaults) {
        const defaults = groupDefaults[i];
        for (const prop in defaults) {
          if (!feature[prop]) {
            feature[prop] = Object.assign({}, defaults[prop]);
          }
        }
      }
    }
  }

  function loadIconDefaults(feature) {
    if (!feature.iconInfo) feature.iconInfo = {};
    if (feature.icon) feature.iconInfo.file = feature.icon;
    if (!feature.iconInfo.fill && !feature.iconInfo.bg_fill) {
      feature.iconInfo.bg_fill = colors.text;
      feature.iconInfo.fill = colors.text_halo;
    }

    if (!feature.disallowedAccessIconInfo) feature.disallowedAccessIconInfo = {};
    if (!feature.disallowedAccessIconInfo.file) {
      feature.disallowedAccessIconInfo.file = feature.iconInfo.file;
    }
    if (!feature.disallowedAccessIconInfo.fill && !feature.disallowedAccessIconInfo.bg_fill) {
      if (feature.iconInfo.fill) feature.disallowedAccessIconInfo.fill = chroma.mix(feature.iconInfo.fill, "#eee", 0.5, "rgb").hex();
      if (feature.iconInfo.bg_fill) feature.disallowedAccessIconInfo.bg_fill = chroma.mix(feature.iconInfo.bg_fill, "#eee", 0.5, "rgb").hex();
    }
  }
}

async function fetchPresetById() {
  const presetsById = await fetch('/dist/presets.json')
    .then(response => response.json());
  for (const presetId in presetsById) {
    const preset = presetsById[presetId];
    preset.id = presetId;
    if (!presetsById[presetId].icon) {
      const parentIdForIcon = presetsById[presetId].parents?.find(parentId => presetsById[parentId].icon);
      if (parentIdForIcon) presetsById[presetId].icon = presetsById[parentIdForIcon].icon;
    }
  }
  return presetsById;
}

async function fetchThemesById() {

  const themesById = {};

  function addTheme(id, theme) {
    if (themesById[id]) {
      console.error(`Duplicate theme id ${id}`);
    } else {
      theme.id = id;
      if (!theme.name) theme.name = theme.id.replaceAll('_', ' ');
      theme.searchName = theme.name.toLowerCase()
        // strip diacritics
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      themesById[id] = theme;
    }
  }

  function addThemeForPreset(preset) {
    if (preset.autoTheme === false) return;
    
    // id normalization needs to match those in urlController.js
    const themeId = preset.plural
      .replaceAll(' ', '_')
      .toLowerCase()
      // strip diacritics
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    addTheme(themeId, {
      name: preset.plural,
      groupType: "feature_type",
      features: [
        {
          presets: [preset.id]
        }
      ]
    });
  }

  const themesByIdFromFile = await fetch('/dist/themes.json')
    .then(response => response.json());

  for (const id in themesByIdFromFile) {
    addTheme(id, themesByIdFromFile[id]);
  }

  const presetsById = await fetchPresetById();
  for (const presetId in presetsById) {
    addThemeForPreset(presetsById[presetId]);
  }

  resolveForeignThemeReferences(themesById);
  resolvePresetReferences(themesById, presetsById);
  loadDefaultThemeProperties(themesById);

  console.log(Object.keys(themesById).length + ' themes');
  return themesById;
}

export const themesPromise = fetchThemesById();