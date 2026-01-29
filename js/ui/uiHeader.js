import { createElement } from "../utils.js";
import { getSvg } from "../svgManager.js";
import { themeExplorer } from "./uiThemeExplorer.js";
import { themeInspector } from "./uiThemeInspector.js";
import { state } from "../stateController.js";
import { themeIconElement } from './uiThemeIcon.js';


let exploreMapsButton,
  themeTitle,
  openIcon,
  closeIcon;

const parser = new DOMParser();

export const header = createElement('div')
  .setAttribute('id', 'header')
  .append(
    createElement('div')
      .setAttribute('id', 'header-header')
      .append(
        exploreMapsButton = createElement('button')
          .setAttribute('id', 'explore-maps')
          .addEventListener('mousedown', e => e.stopPropagation())
          .addEventListener('click', _ => {
            state.toggle('themeExplorerOpen');
            exploreMapsButton.blur();
          })
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
      .addEventListener('click', _ => {
        state.toggle('themeInspectorOpen');
        themeTitle.blur();
      }),
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
      .append(
        openIcon = createElement('div')
          .setAttribute('class', 'icon')
          .setAttribute('style', "width:15px;height:15px;")
          .append(
            parser.parseFromString((await getSvg({file: 'ellipsis', fill: 'currentColor'})).string, "image/svg+xml").documentElement
          ),
        closeIcon = createElement('div')
          .setAttribute('class', 'icon')
          .setAttribute('style', "width:15px;height:15px;")
          .append(
            parser.parseFromString((await getSvg({file: 'x_cross', fill: 'currentColor'})).string, "image/svg+xml").documentElement
          )
      )
  );
  updateForInspectorOpen();
}

function updateForInspectorOpen() {
  if (state.themeInspectorOpen) {
    openIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
  } else {
    openIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  }
}

state.addEventListener('change-theme', reload);
state.addEventListener('change-themeInspectorOpen', updateForInspectorOpen);