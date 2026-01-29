import { createElement } from "../utils.js";
import { getSvg } from "../svgManager.js";
import { themeExplorer } from "./uiThemeExplorer.js";
import { themeInspector } from "./uiThemeInspector.js";
import { state } from "../stateController.js";
import { themeIconElement } from './uiThemeIcon.js';

state.addEventListener('change-theme', reload);

let themeTitle;

const parser = new DOMParser();

export const header = createElement('div')
  .setAttribute('id', 'header')
  .append(
    createElement('div')
      .setAttribute('id', 'header-header')
      .append(
        createElement('button')
          .setAttribute('id', 'explore-maps')
          .addEventListener('mousedown', e => e.stopPropagation())
          .addEventListener('click', _ => state.toggle('themeExplorerOpen'))
          .append(
            createElement('div')
              .setAttribute('class', 'icon')
              .setAttribute('style', "width:14px;height:14px;")
              .append(
                parser.parseFromString((await getSvg({file: 'map-swap', fill: 'currentColor'})).string, "image/svg+xml").documentElement
              ),
            createElement('span')
              .append('Explore maps'),
            createElement('div')
              .setAttribute('class', 'icon')
              .setAttribute('style', "width:8px;height:8px;font-size:0.5em;")
              .append(
                parser.parseFromString((await getSvg({file: 'triangle_isosceles_down_rounded', fill: 'currentColor'})).string, "image/svg+xml").documentElement
              )
          ),
        themeExplorer
      ),
    themeTitle = createElement('button')
      .setAttribute('id', 'main-theme-title')
      .addEventListener('click', _ => state.toggle('themeInspectorOpen')),
    themeInspector
  );

reload();

async function reload() {
  themeTitle?.replaceChildren(
    await themeIconElement(state.theme),
    createElement('div')
      .setAttribute('class', 'text-part')
      .append(
        createElement('span')
          .setAttribute('class', 'pre-theme-title')
          .append('the map is '),
        createElement('span')
          .setAttribute('class', 'theme-title')
          .append(state.theme?.name || '…')
      ),
    createElement('div')
      .setAttribute('class', 'icon')
      .setAttribute('style', "width:16px;height:16px;")
      .append(
        parser.parseFromString((await getSvg({file: 'map-info', fill: 'currentColor'})).string, "image/svg+xml").documentElement
      ),
    createElement('div')
      .setAttribute('class', 'icon')
      .setAttribute('style', "width:8px;height:8px;")
      .append(
        parser.parseFromString((await getSvg({file: 'triangle_isosceles_down_rounded', fill: 'currentColor'})).string, "image/svg+xml").documentElement
      )
  );
}