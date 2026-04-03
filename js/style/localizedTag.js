export function localizedNameExpressions(opts) {

  const langs = opts.langs;
  const osmLangSuffixes = [];
  langs.forEach(lang => {
    const parts = lang.split('-');
    while (parts.length) {
      const builtLang = ':' + parts.join('-');
      if (!osmLangSuffixes.includes(builtLang)) osmLangSuffixes.push(builtLang);
      parts.pop();
    }
  });
  osmLangSuffixes.push('');

  const osmNameKeys = osmLangSuffixes.map(suffix => "name" + suffix).concat(["ref"]);

  const localizedName = ["coalesce", ...osmNameKeys.map(key => ["get", key])];
  const hasLocalizedName = ["any", ...osmNameKeys.map(key => ["has", key])];
  // const nativeName = ["coalesce", ["get", "name"], ["get", "ref"]];
  // const labelTextField = [
  //   "case",
  //   [
  //     "all",
  //     ["!", ["in", ["get", "place"], ["literal", ["continent", "ocean", "sea"]]]],
  //     ["!", ["in", localizedName, nativeName]]
  //   ], ["format", localizedName, {},"\n", {}, nativeName, {"font-scale": 0.85}],
  //   localizedName
  // ];

  return { osmLangSuffixes, osmNameKeys, localizedName, hasLocalizedName };
}