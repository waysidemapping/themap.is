import { state } from "./stateController.js";
import { themesPromise } from "./themeManager.js";

const defaultThemeIds = ['parks', 'restaurants'];

function updateUrlForApp() {
  const themeId = state.theme?.id || '';
  const desiredPathname = '/' + encodeURI(themeId);
  const url = new URL(window.location.href);
  if (url.pathname !== desiredPathname) {
    url.pathname = desiredPathname;
    history.replaceState({}, "", url);
  }

  const themeName = state.theme?.name ? state.theme.name + ' ' : '';
  const desiredTitle = `the map is ${themeName}by Wayside Mapping`;
  if (document.title !== desiredTitle) {
    document.title = desiredTitle;
  }
}

async function updateAppForUrl() {
  const url = new URL(window.location.href);

  // Normalize
  let desiredThemeId = decodeURIComponent(url.pathname.substring(1))
    .trim()
    // replace runs of underscores or whitespaces with single underscore
    .replace(/[\s_]+/g, "_")
    .toLowerCase()
    // strip diacritics
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let themes = await themesPromise;
  let desiredTheme = themes[desiredThemeId] || null;
  // we always want a theme so just load a good one if none is specified
  if (!desiredTheme) {
    desiredThemeId = defaultThemeIds[Math.floor(Math.random() * defaultThemeIds.length)];
    desiredTheme = themes[desiredThemeId];
  }
  
  const desiredPathname = '/' + encodeURI(desiredThemeId);
  if (url.pathname !== desiredPathname) {
    url.pathname = desiredPathname;
    // set the URL based on the canonical name
    history.replaceState({}, "", url);
  }

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
state.addEventListener('change-theme', function() {
  updateUrlForApp();
});
