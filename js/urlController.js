import { state } from "./stateController.js";
import { themesPromise } from "./themeManager.js";

function updateUrlForApp() {
  let themeId = state.theme?.id || '';
  let desiredPathname = '/' + themeId;
  const url = new URL(window.location.href);
  if (url.pathname !== desiredPathname) {
    url.pathname = desiredPathname;
    history.replaceState({}, "", url);
  }
}

async function updateAppForUrl() {
  const url = new URL(window.location.href);
  let desiredThemeId = url.pathname.substring(1);
  let themes = await themesPromise;
  let desiredTheme = themes[desiredThemeId] || null;
  if (state.theme?.id !== desiredTheme?.id) {
    state.set('theme', desiredTheme);
  }
}

// update for the URL first to incorporate any encoded state
updateAppForUrl();
updateUrlForApp();
window.addEventListener("hashchange", function() {
  updateAppForUrl();
});
state.addEventListener('change', function() {
  updateUrlForApp();
});
