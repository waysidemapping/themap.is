const yesAccessValsLiteral = ["literal", ["yes", "designated", "customers", "permissive", "permit", "destination"]];

function getTagsExp(tags) {
  let exp = [];
  for (let key in tags) {
    let value = tags[key];
    if (value === '*') {
      exp.push(["has", key]);
    } else {
      exp.push(["in", value, ["split", ["coalesce", ["get", key], ""], ";"]]);
    }
  }
  if (exp.length === 1) {
    return exp[0];
  } else {
    exp.unshift("all");
    return exp;
  }
}

function getRTagsExp(tags) {
  let exp = [];
  for (let key in tags) {
    let value = tags[key];
    if (value === '*') {
      exp.push(["has", `r.${key}`]);
    } else {
      exp.push(["in", value, ["split", ["coalesce", ["get", `r.${key}`], ""], "┃"]]);
    }
  }
  if (exp.length === 1) {
    return exp[0];
  } else {
    exp.unshift("all");
    return exp;
  }
}

export function getAccessExp(accessInfos) {

  let fullExp = [];
  
  for (const j in accessInfos) {
    const accessInfo = accessInfos[j];
    const accessKeys = accessInfo.keys;
    const allowedByDefault = accessInfo.allowedByDefault;

    let exp = [];
  
    for (const i in accessKeys) {
      const accessKey = accessKeys[i];
      let expForKey = ["in", ["get", accessKey], yesAccessValsLiteral];
      if (allowedByDefault) {
        expForKey = [
          "any",
          ["!", ["has", accessKey]],
          expForKey
        ];
      }
      const moreProminentKeys = accessKeys.slice(0, parseInt(i));
      if (moreProminentKeys.length > 0) {
        expForKey = [
          "all",
          ...moreProminentKeys.map(key => ["!", ["has", key]]),
          expForKey
        ];
      }
      exp.push(expForKey);
    }
    if (exp.length > 1) {
      exp.unshift("any");
    } else {
      exp = exp[0];
    }
    fullExp.push(exp);
  }
  if (fullExp.length > 1) {
    fullExp.unshift("all");
  } else {
    fullExp = fullExp[0];
  }
  return fullExp;
}

export function expressionForFeature(feature) {
  let exp = feature.geometry?.includes('relation') ? getRTagsExp(feature.tags) : getTagsExp(feature.tags);
  if (feature.access && feature.showOnlyAccess) {
    let accessExp = getAccessExp(feature.access);
    if (feature.showOnlyAccess === "disallowed") {
      accessExp = ["!", accessExp];
    }
    exp = ["all", exp, accessExp];
  }
  return exp;
}