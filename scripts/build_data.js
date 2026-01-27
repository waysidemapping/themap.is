import fs from "fs";
import path from "path";

const presets = {};

const allowedKeys = {
  "name":{required: true},
  "autoTheme": {},
  "plural":{},
  "tags":{required: true},
  "geometry":{required: true},
  "icon":{},
  "groups":{},
  "terms":{},
  "matchScore":{},
  "reference":{}
};

const allGroups = {};

function processPreset(id, json) {
  for (let key in json){
    if (!allowedKeys[key]) {
      console.log(`Unexpected key ${key} for ${id}`);
    }
  }

  for (let key in allowedKeys){
    if (allowedKeys.required && !json[key]) {
      console.log(`Missing required key ${key} for ${id}`);
    }
  }

  if (json.icon) {
    if (!fs.existsSync(`icons/${json.icon}.svg`)) {
      console.log(`Missing icon file "${json.icon}.svg" for ${id}`)
    }
  }

  if (json.groups) {
    json.groups.forEach(group => allGroups[group] = true);
  }

  // not needed at the moment
  delete json.terms;

  if (id.includes("/")) {
    let parentId = id.substring(0, id.lastIndexOf("/"));

    let parent = presets[parentId];
    if (!parent) {
      console.error(`Missing parent preset for ${id}`);
    } else {
      for (let key in parent.tags) {
        if (!json.tags[key] || (parent.tags[key] !== '*' && parent.tags[key] !== json.tags[key])) {
          console.error(`Unexpected tags for ${id} with parent ${parentId}`);
        }
      }
    }

    let parentIdParts = parentId.split('/');
    json.parents = parentIdParts.map((_, i) => parentIdParts.slice(0, i + 1).join('/')).toReversed();

    let parentIcon = json.parents.map(id => presets[id].icon).find(icon => icon);
    if (json.icon && parentIcon && parentIcon === json.icon) {
      console.log(`Redundant icon ${json.icon} for ${id}`);
    }
    
    if (!json.geometry) {
      json.geometry = parent.geometry;
    }
    if (!json.groups) {
      json.groups = parent.groups;
    }
  }

  presets[id] = json;
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
    processPreset(id, json);
  }
});

fs.writeFileSync('./dist/presets.json', JSON.stringify(presets))

console.log("Preset groups: " + Object.keys(allGroups).sort().join(', '))
