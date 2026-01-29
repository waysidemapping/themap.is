import { createElement } from "../utils.js";
import { getSvg } from "../svgManager.js";
import { themeExplorer } from "./uiThemeExplorer.js";
import { state } from "../stateController.js";
import { themeIconElement } from './uiThemeIcon.js';

state.addEventListener('change-theme', reload);

let themeTitle;

export const header = createElement('div')
  .setAttribute('id', 'header')
  .append(
    createElement('button')
      .setAttribute('id', 'explore-maps')
      .addEventListener('click', _ => state.toggle('themeExplorerOpen'))
      .append(
        createElement('img')
          .setAttribute('class', 'icon')
          .setAttribute('style', "width:14px;height:14px;")
          .setAttribute('src', `data:image/svg+xml;utf8,${encodeURIComponent((await getSvg({file: 'map-swap', fill: '#666'})).string)}`),
        createElement('span')
          .append('Explore maps'),
        createElement('img')
          .setAttribute('class', 'icon')
          .setAttribute('style', "width:8px;height:8px;font-size:0.5em;")
          .setAttribute('src', `data:image/svg+xml;utf8,${encodeURIComponent((await getSvg({file: 'triangle_isosceles_down_rounded', fill: '#666'})).string)}`),
      ),
    themeExplorer,
    themeTitle = createElement('h1')
      .setAttribute('id', 'main-map-title')
  );

reload();

async function reload() {
  themeTitle?.replaceChildren(
    await themeIconElement(state.theme),
    createElement('div')
      .setAttribute('class', 'text-part')
      .append(
        createElement('span')
          .setAttribute('class', 'pre-maptitle')
          .append('the map is '),
        createElement('span')
          .setAttribute('class', 'maptitle')
          .append(state.theme?.name)
        )
      )
}