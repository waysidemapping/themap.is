import { createElement, getElementById } from "./utils.js";
import { state } from "./stateController.js";

window.addEventListener('load', function() {

  state.addEventListener('change-theme', function() {
    updateUi();
  });

  updateUi();
});

function updateUi () {

  let baseElement = getElementById('ui');
  if (!baseElement) return;

  let theme = state.theme;

  let themeColor = theme?.primaryColor;
  if (themeColor) {
    baseElement.style.setProperty("--primary-color", themeColor);
  } else {
    baseElement.style.removeProperty("--primary-color");
  }

  baseElement.replaceChildren(
    createElement('div')
      .setAttribute('id', 'header')
      .append(
        createElement('h1')
          .append(
            createElement('span')
              .setAttribute('class', 'pre-maptitle')
              .append('the map is '),
            createElement('span')
              .setAttribute('class', 'maptitle')
              .append(theme?.name)
          )
      )
  );

}