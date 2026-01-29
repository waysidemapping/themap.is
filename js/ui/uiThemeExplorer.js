import { createElement } from "../utils.js";
import { getSvg } from "../svgManager.js";
import { themesPromise } from "../themeManager.js";
import { editDistance } from "../utils.js";
import { state } from "../stateController.js";
import { themeIconElement } from './uiThemeIcon.js';

let searchInput;
let resultsList;

export const themeExplorer = createElement('div')
  .setAttribute('id', 'theme-explorer')
  .setAttribute('class', 'overlay hidden')
  .append(
    createElement('div')
      .setAttribute('class', 'search-wrap')
      .append(
        createElement('img')
          .setAttribute('class', 'icon')
          .setAttribute('style', "width:15px;height:15px;")
          .setAttribute('src', `data:image/svg+xml;utf8,${encodeURIComponent((await getSvg({file: 'magnifying_glass', fill: '#666'})).string)}`),
        searchInput = createElement('input')
          .setAttribute('class', 'search')
          .setAttribute('type', 'search')
          .setAttribute('placeholder', 'the map is…')
          .setAttribute('autofocus', '')
          .addEventListener('keydown', e => {
            if (e.keyCode === 13 && // ↩ Return
                e.target.value.length) {
                resultsList.querySelector('li:first-child button')?.dispatchEvent(new Event("click"));
            }
        })
          .addEventListener('input', function() {
            if (resultsList.scrollTop !== 0) resultsList.scrollTop = 0;
            updateList();
          })
      ),
    resultsList = createElement('ul')
      .setAttribute('class', 'search-results')
  );

async function updateList() {
  let themes = await themesPromise;
  let value = (searchInput?.value || '')
    .trim()
    .toLowerCase()
    // strip diacritics
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let items = value ? Object.values(themes).map(theme => {
      return {theme, dist: editDistance(theme.searchName, value)}
    })
    .filter(item => item.dist + Math.min(value.length - item.theme.searchName.length, 0) < 1)
    .map(item => {
      return {
        theme: item.theme,
        score: -item.dist + (item.theme.searchName.includes(value) ? (item.theme.searchName.startsWith(value) ? 10000 : 1000) : 0)
      };
    })
    .sort((a, b) => b.score - a.score)
    .map(item => item.theme) : Object.values(themes).sort((a, b) => b.searchName < a.searchName);

  resultsList?.replaceChildren(
    ...(await Promise.all(items.map(async theme => {
      return createElement('li')
        .setAttribute("class", "theme-item")
        .setAttribute('style', `--primary-color:${theme.primaryColor}`)
        .append(
          createElement('button')
            .setAttribute("class", "theme-button")
            .setAttribute('value', theme.id)
            .addEventListener('click', _ => state.set({'theme': theme, 'themeExplorerOpen': false}))
            .append(
              await themeIconElement(theme),
              createElement('span')
                .setAttribute('class', 'theme-title')
                .append(theme.name)
            )
        )
    })))
  );
}

updateList();

state.addEventListener('change-themeExplorerOpen', _ => {
  if (state.themeExplorerOpen) {
    themeExplorer?.classList.remove('hidden');
    document.documentElement.classList.add('themeExplorerOpen');
    searchInput?.focus();
    searchInput?.select();
  } else {
    themeExplorer?.classList.add('hidden');
    document.documentElement.classList.remove('themeExplorerOpen');
  }
})