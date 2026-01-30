import { colors } from './colors.js';

const presetGroupThemes = {
  "bees": {groupType: "theme"},
  "books": {groupType: "commodity"},
  "dams": {groupType: "feature_type"},
  "islands": {groupType: "feature_type"},
  "free stuff": {groupType: "commodity"},
  "gambling": {groupType: "activity"},
  "healthcare": {groupType: "theme"},
  "lodging": {groupType: "commodity"},
  "mail": {groupType: "theme"},
  "maps": {groupType: "commodity"},
  "motorcycling": {groupType: "activity"},
  "stores": {groupType: "feature_type"},
  "street furniture": {groupType: "feature_type"},
  "swimming": {groupType: "activity"},
  "vehicle rental": {groupType: "feature_type"},
  "vehicle repair shops": {groupType: "feature_type"},
  "waterway access": {groupType: "feature_type"},
};

const featureDefaultsByGroup = {
  "aboriginal lands": {
    icon: { 
      bg_fill: colors.aboriginal_lands_icon,
      fill: colors.text_halo
    }
  },
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
  barriers: {
    icon: { 
      bg_fill: colors.barrier_icon,
      fill: colors.text_halo
    }
  },
  bathing_water: {
    icon: { 
      bg_fill: colors.swimming_pool_icon,
      fill: colors.text_halo
    }
  },
  craft: {
    icon: { 
      bg_fill: colors.craft_icon,
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
      bg_fill: colors.lodging_icon,
      fill: colors.text_halo
    }
  },
  offices: {
    icon: { 
      bg_fill: colors.office_icon,
      fill: colors.text_halo
    }
  },
  "outdoor recreation": {
    icon: { 
      bg_fill: colors.outdoor_recreation_icon,
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
  plants: {
    icon: { 
      bg_fill: colors.plants_icon,
      fill: colors.text_halo
    }
  },
  power: {
    icon: { 
      bg_fill: colors.power_icon,
      fill: colors.text_halo
    }
  },
  religious: {
    icon: { 
      bg_fill: colors.religious_icon,
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

  for (let groupId in presetGroupThemes) {
    addTheme(groupId.replaceAll(' ', '_'), {
      groupType: presetGroupThemes[groupId].groupType,
      features: [
        {
          presetGroups: [groupId]
        }
      ]
    });
  }

  const themesByIdFromFile = await fetch('/dist/themes.json').then(response => response.json());
  for (let id in themesByIdFromFile) {
    if (!themesByIdFromFile[id].groupType) themesByIdFromFile[id].groupType = 'theme';
    addTheme(id, themesByIdFromFile[id]);
  }

  const presetIdsByTag = {};
  const presetsById = await fetch('/dist/presets.json').then(response => response.json());
  for (let presetId in presetsById) {
    let preset = presetsById[presetId];
    preset.id = presetId;
    for (const key in preset.tags) {
      const tagString = key + '=' + preset.tags[key];
      if (!presetIdsByTag[tagString]) presetIdsByTag[tagString] = [];
      presetIdsByTag[tagString].push(presetId);
    }
    if (preset.plural && preset.autoTheme !== false) {
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
              presets: [presetId]
            }
          ]
        });
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

    let expandedFeatures = [];
    for (let i in theme.features) {
      if (theme.features[i].presetGroups) {
        let presets = Object.values(presetsById).filter(preset => preset.groups?.some(group => theme.features[i].presetGroups.includes(group)))
        theme.features[i].presets = presets.map(preset => preset.id);
      }

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
      if (theme.features[i].tags) {
        // always include the tags at the end even if we matched them to a preset, assuming the tags are more generalized
        expandedFeatures.push(theme.features[i]);
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
  console.log(Object.keys(themesById).length + ' themes');
  return themesById;
}

export const themesPromise = loadData();