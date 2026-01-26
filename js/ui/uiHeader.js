import { createElement } from "../utils.js";
import { getSvg } from "../svgManager.js";
import { themeExplorer } from "./uiThemeExplorer.js";
import { state } from "../stateController.js";

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
          .setAttribute('src', `data:image/svg+xml;utf8,${encodeURIComponent((await getSvg('/icons/map-swap.svg', {fill: '#666'})).string)}`),
        createElement('span')
          .append('Explore maps'),
        createElement('img')
          .setAttribute('class', 'icon')
          .setAttribute('style', "width:8px;height:8px;font-size:0.5em;")
          .setAttribute('src', `data:image/svg+xml;utf8,${encodeURIComponent((await getSvg('/icons/triangle_isosceles_down_rounded.svg', {fill: '#666'})).string)}`),
      ),
    themeExplorer,
    createElement('h1')
      .append(
        createElement('span')
          .setAttribute('class', 'pre-maptitle')
          .append('the map is '),
        themeTitle = createElement('span')
          .setAttribute('class', 'maptitle')
      )
  );

reload();

function reload() {
  themeTitle?.replaceChildren(state.theme?.name)
}