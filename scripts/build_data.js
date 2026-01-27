import fs from "fs";
import path from "path";

const presetsById = {};
const allGroups = {};

const allowedKeys = {
  "name":{required: true},
  "plural":{},
  "groups":{},
  "autoTheme": {},
  "tags":{required: true},
  "reference":{},
  "geometry":{},
  "terms":{},
  "icon":{},
  "matchScore":{}
};

function readPreset(id, json) {
  if (json.groups) {
    json.groups.forEach(group => allGroups[group] = true);
  }
  presetsById[id] = json;
}

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
    if (!fs.existsSync(`icons/${json.icon}.svg`)) {
      console.log(`🛑 Missing icon file "${json.icon}.svg" for ${id}`)
      return false;
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
    readPreset(id, json);
  }
});

for (let presetId in presetsById) {
  if (!checkPreset(presetId, presetsById[presetId])) process.exit(1);

  let sortedObj = {};
  for (let key in allowedKeys) {
    if (presetsById[presetId][key]) sortedObj[key] = presetsById[presetId][key];
  }
  presetsById[presetId] = sortedObj;
  fs.writeFileSync(presetsDir + presetId + '.json', JSON.stringify(presetsById[presetId], null, 4));

  addDerivedDataToPreset(presetId, presetsById[presetId]);
}

fs.writeFileSync('./dist/presets.json', JSON.stringify(presetsById))

console.log("Preset groups: " + Object.keys(allGroups).sort().join(', '))
