import fs from "fs";
import path from "path";

async function fetchKeyList(filename) {
  return (await fetch(`https://cdn.jsdelivr.net/gh/waysidemapping/beefsteak-map-tiles/server/schema_data/${filename}.txt`)
    .then(result => result.text())).trim().split('\n').filter(Boolean);
}

const knownKeys = (await fetchKeyList('point_key'))
  .concat((await fetchKeyList('line_key')))
  .concat((await fetchKeyList('area_key')))
  .concat((await fetchKeyList('relation_key')));

const knownKeyPrefixes = (await fetchKeyList('point_key_prefix'))
  .concat((await fetchKeyList('line_key_prefix')))
  .concat((await fetchKeyList('area_key_prefix')))
  .concat((await fetchKeyList('relation_key_prefix')));

const prefixRegex = new RegExp(`^(${knownKeyPrefixes.join('|')}).+`);

const presetsById = {};
const allGroups = {};

const allowedKeys = {
  "name":{required: true},
  "plural":{required: true},
  "autoTheme": {},
  "groups":{},
  "tags":{required: true},
  "reference":{},
  "geometry":{},
  "terms":{},
  "icon":{},
  "matchScore":{}
};


const allowedGeometry = [
  "point",
  "vertex",
  "line",
  "area",
  "relation"
];

const specialCharsRegex = /[^\p{Script=Latin}\p{N} '-]/u;

function checkPreset(id, json) {
  for (let key in json){
    if (!allowedKeys[key]) {
      console.log(`🛑 Unexpected key ${key} for ${id}`);
      return false;
    }
  }

  for (let key in allowedKeys){
    if (allowedKeys[key].required && !json[key]) {
      console.log(`🛑 Missing required key ${key} for ${id}`);
      return false;
    }
  }

  if (json.icon) {
    if (!fs.existsSync(`dist/icons/${json.icon}.svg`)) {
      console.log(`🛑 Missing icon file "${json.icon}.svg" for ./data/presets/${id}.json`);
      return false;
    }
  }

  if (specialCharsRegex.test(json.name)) {
    console.log(`🛑 Unexpected characters in name "${json.name}" of ${id}`);
    return false;
  }

  for (let key in json.tags) {
    if (!knownKeys.includes(key) && !key.match(prefixRegex)) {
      console.log(`⚠️ Preset ${id} references key "${key}" which is not preset in map tiles`);
    }
  }

  if (json.geometry) {
    for (let i in json.geometry) {
      if (!allowedGeometry.includes(json.geometry[i])) {
        console.log(`🛑 Unknown geometry type "${json.geometry[i]}" for ${id}`);
        return false;
      }
    }
  }

  if (id.includes("/")) {
    let parentId = id.substring(0, id.lastIndexOf("/"));

    let parent = presetsById[parentId];
    if (!parent) {
      console.error(`🛑 Missing parent preset for ${id}`);
    } else {
      for (let key in parent.tags) {
        if (!json.tags[key] || (parent.tags[key] !== '*' && parent.tags[key] !== json.tags[key])) {
          console.error(`🛑 Unexpected tags for ${id} with parent ${parentId}`);
          return false;
        }
      }
    }

    let parentIdParts = parentId.split('/');
    let parentIds = parentIdParts.map((_, i) => parentIdParts.slice(0, i + 1).join('/')).toReversed();

    let parentIcon = parentIds.map(id => presetsById[id].icon).find(icon => icon);
    if (json.icon && parentIcon && parentIcon === json.icon) {
      console.log(`🛑 Redundant icon ${json.icon} for ${id}`);
      return false;
    }
  }

  return true;
}

function addDerivedDataToPreset(id, json) {
  if (id.includes("/")) {
    let parentId = id.substring(0, id.lastIndexOf("/"));
    let parent = presetsById[parentId];
    let parentIdParts = parentId.split('/');
    json.parents = parentIdParts.map((_, i) => parentIdParts.slice(0, i + 1).join('/')).toReversed();
    
    if (!json.geometry) {
      json.geometry = parent.geometry;
    }
    if (!json.groups) {
      json.groups = parent.groups;
    }
  }
}

function checkTheme(id, json) {

  if (json.icon) {
    if (!fs.existsSync(`dist/icons/${json.icon}.svg`)) {
      console.log(`🛑 Missing icon file "${json.icon}.svg" for ${id}`);
      return false;
    }
  }

  if (specialCharsRegex.test(json.name)) {
    console.log(`🛑 Unexpected characters in name "${json.name}" of ${id}`);
    return false;
  }

  for (let i in json.features) {
    let featuresJson = json.features[i];
    if (featuresJson.icon) {
      if (!fs.existsSync(`dist/icons/${featuresJson.icon}.svg`)) {
        console.log(`🛑 Missing icon file "${featuresJson.icon}.svg" specified in theme ${id}`);
        return false;
      }
    }
    if (featuresJson.tags) {
      for (let key in featuresJson.tags) {
        if (!knownKeys.includes(key) && !key.match(prefixRegex)) {
          console.log(`⚠️ Preset ${id} references key "${key}" which is not preset in map tiles`);
        }
      }
    }
    if (featuresJson.presets) {
      for (let j in featuresJson.presets) {
        if (!presetsById[featuresJson.presets[j]]) {
          console.log(`🛑 Unknown preset "${featuresJson.presets[j]}" referenced by theme ${id}`);
          return false;
        }
      }
    }
    if (featuresJson.themes) {
      for (let j in featuresJson.themes) {
        if (!themesById[featuresJson.themes[j]]) {
          console.log(`🛑 Unknown theme "${featuresJson.themes[j]}" referenced by theme ${id}`);
          return false;
        }
      }
    }
  }

  return true;
}

function walkDir(dir, func) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Process files first
  for (const entry of entries) {
    if (entry.isFile()) {
      const filePath = path.join(dir, entry.name);
      func(filePath);
    }
  }

  // Then walk subdirectories
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subDir = path.join(dir, entry.name);
      walkDir(subDir, func);
    }
  }
}

const presetsDir = "data/presets/";
walkDir(presetsDir, function(filePath) {
  if (filePath.endsWith(".json")) {
    const id = filePath.substring(presetsDir.length, filePath.length - 5);
    const json = JSON.parse(fs.readFileSync(filePath));
    if (json.groups) {
      json.groups.forEach(group => allGroups[group] = true);
    }
    presetsById[id] = json;
  }
});

for (let presetId in presetsById) {
  if (!checkPreset(presetId, presetsById[presetId])) process.exit(1);

  let sortedObj = {};
  for (let key in allowedKeys) {
    if (typeof presetsById[presetId][key] !== 'undefined') sortedObj[key] = presetsById[presetId][key];
  }
  presetsById[presetId] = sortedObj;
  fs.writeFileSync(presetsDir + presetId + '.json', JSON.stringify(presetsById[presetId], null, 4));

  addDerivedDataToPreset(presetId, presetsById[presetId]);
}

const themesById = {};
const themesDir = "data/themes/";
walkDir(themesDir, function(filePath) {
  if (filePath.endsWith(".json")) {
    const id = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length - 5);
    const json = JSON.parse(fs.readFileSync(filePath));
    themesById[id] = json;
  }
});

for (let themeId in themesById) {
  if (!checkTheme(themeId, themesById[themeId])) process.exit(1);
}

fs.writeFileSync('./dist/presets.json', JSON.stringify(presetsById));
console.log(`Wrote ${Object.values(presetsById).length} presets`);

console.log("Preset groups: " + Object.keys(allGroups).sort().join(', '));

fs.writeFileSync('./dist/themes.json', JSON.stringify(themesById));
console.log(`Wrote ${Object.values(themesById).length} themes`);