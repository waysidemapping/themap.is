import fs from "fs";
import path from "path";

let featureTypeDir = "data/presets/";

const presets = {};

const allowedKeys = {
  "name":{required: true},
  "tags":{required: true},
  "geometry":{required: true},
  "icon":{},
  "terms":{},
  "matchScore":{},
  "reference":{}
};

function processPreset(id, json) {
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
    if (!json.geometry) {
      json.geometry = parent.geometry;
    }
    if (!json.icon) {
      json.icon = parent.icon;
    }
  }

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
      console.log(`Missing icon file ${json.icon} for ${id}`)
    }
  }

  presets[id] = json;
}

function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Process files first
  for (const entry of entries) {
    if (entry.isFile()) {
      const filePath = path.join(dir, entry.name);
      if (filePath.endsWith(".json")) {
        const id = filePath.substring(featureTypeDir.length, filePath.length - 5);
        const json = JSON.parse(fs.readFileSync(filePath));
        processPreset(id, json);
      }
    }
  }

  // Then walk subdirectories
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subDir = path.join(dir, entry.name);
      walkDir(subDir, fileList);
    }
  }

  return fileList;
}

const allFiles = walkDir(featureTypeDir);