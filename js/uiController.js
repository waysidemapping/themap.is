import { createElement, getElementById } from "./utils.js";
import { state } from "./stateController.js";
import { getSvg } from "./svgManager.js";

window.addEventListener('load', function() {

  state.addEventListener('change-theme', function() {
    updateUi();
  });

  updateUi();
});

async function updateUi () {

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
        createElement('button')
          .setAttribute('id', 'explore-maps')
          .append(
            createElement('img')
              .setAttribute('class', 'icon')
              .setAttribute('style', "width:14px;height:14px;")
              .setAttribute('src', `data:image/svg+xml;utf8,${encodeURIComponent((await getSvg('/icons/map-swap.svg', {fill: '#666'})).string)}`),
            createElement('span')
              .append('Explore maps'),
            createElement('img')
              .setAttribute('class', 'icon')
              .setAttribute('style', "width:8px;height:8px;font-size:0.5em;")
              .setAttribute('src', `data:image/svg+xml;utf8,${encodeURIComponent((await getSvg('/icons/triangle_isosceles_down_rounded.svg', {fill: '#666'})).string)}`),
          ),
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