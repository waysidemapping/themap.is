import { state } from "./stateController.js";
import { themesPromise } from "./themeManager.js";

function updateUrlForApp() {
  let themeId = state.theme?.id || '';
  let desiredPathname = '/' + encodeURI(themeId);
  const url = new URL(window.location.href);
  if (url.pathname !== desiredPathname) {
    url.pathname = encodeURI(desiredPathname);
    history.replaceState({}, "", url);
  }
}

async function updateAppForUrl() {
  const url = new URL(window.location.href);

  // Normalize
  const canonicalThemeId = decodeURIComponent(url.pathname.substring(1))
    .trim()
    // replace runs of underscores or whitespaces with single underscore
    .replace(/[\s_]+/g, "_")
    .toLowerCase()
    // strip diacritics
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const desiredPathname = '/' + encodeURI(canonicalThemeId);
  if (url.pathname !== desiredPathname) {
    url.pathname = desiredPathname;
    // set the URL based on the cacn
    history.replaceState({}, "", url);
  }

  let themes = await themesPromise;
  let desiredTheme = themes[canonicalThemeId] || null;
  if (state.theme?.id !== desiredTheme?.id) {
    state.set('theme', desiredTheme);
  }
}


// update for the URL first to incorporate any encoded state
await updateAppForUrl();
updateUrlForApp();
window.addEventListener("hashchange", function() {
  updateAppForUrl();
});
state.addEventListener('change', function() {
  updateUrlForApp();
});
