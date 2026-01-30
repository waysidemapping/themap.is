import { createElement } from "../utils.js";
import { state } from "../stateController.js";

function mapDescriptorText() {
  if (state.theme.groupType === 'feature_type') {
    return `This is a map of <b class="theme-name">${state.theme.name}</b>.`;
  } else if (state.theme.groupType === 'feature_type;commodity') {
    return `This is a map of <b class="theme-name">${state.theme.name}</b> and places where you can find <b class="theme-name">${state.theme.name}</b>.`;
  } else if (state.theme.groupType === 'theme;commodity') {
    return `This is a map of places related to <b class="theme-name">${state.theme.name}</b>, including places where you can find <b class="theme-name">${state.theme.name}</b>.`;
  } else if (state.theme.groupType === 'commodity_descriptor') {
    return `This is a map of places where you can find <b class="theme-name">${state.theme.name}</b> items.`;
  } else if (state.theme.groupType === 'commodity') {
    return `This is a map of places where you can find <b class="theme-name">${state.theme.name}</b>.`;
  }
  return `This is a map of places related to <b class="theme-name">${state.theme.name}</b>.`;
}

export const themeInspector = createElement('div')
  .setAttribute('id', 'theme-inspector')
  .setAttribute('class', 'hidden');

function updateContent() {
  if (!state.theme) {
    themeInspector.replaceChildren('');
    return;
  }
  themeInspector.replaceChildren(
    createElement('article')
      .setAttribute('class', 'prose')
      .append(
        createElement('h3')
          .append('About'),
        createElement('p')
          .insertAdjacentHTML("beforeend", mapDescriptorText() + ' It\'s made with public data from <a target="_blank" href="https://www.openstreetmap.org/about">OpenStreetMap</a>, the free map anyone can edit.'),
        createElement('p')
          .insertAdjacentHTML("beforeend", `If something is amiss, you can fix it yourself. Any edits made to OpenStreetMap will appear here within a few minutes. The same changes will also show up in other apps powered by OpenStreetMap.`),
        // createElement('h3')
        //   .append('Community'),
        // createElement('p')
        //   .insertAdjacentHTML("beforeend", `OpenStreetMap is maintained by a worldwide community of volunteer and professional contributors.`),
        createElement('h3')
          .append('Sponsors'),
        createElement('p')
          .insertAdjacentHTML("beforeend", `This website is free to use but not free to run. You can support this map by <a href="mailto:quincy@waysidemapping.org?subject=${encodeURI('themap.is/' + state.theme.id + ' sponsorship interest')}">becoming a sponsor</a> and having your name or logo appear here.`),
        createElement('h3')
          .append('Disclaimer'),
        createElement('p')
          .insertAdjacentHTML("beforeend", `This map may contain errors and comes with no warranty. It is not an endorsement of any businesses, political boundaries, place names, etc.`),
      ),
    createElement('footer')
      .setAttribute('class', 'prose')
      .append(
        createElement('a')
          .setAttribute('target', '_blank')
          .setAttribute('href', 'https://waysidemapping.org')
          .setAttribute('style', 'display:block;text-align:center;margin-top:24px;')
          .append(
            createElement('img')
              .setAttribute('style', 'max-width:120px;')
              .setAttribute('src', '/img/wayside-mapping-logo.svg'),
          ),
        createElement('p')
          .setAttribute('style', 'text-align:center;margin-bottom:0;')
          .insertAdjacentHTML("beforeend", `themap.is is <a href="https://github.com/waysidemapping/themap.is" target="_blank">free and open source</a>`),
        createElement('p')
          .setAttribute('style', 'text-align:center;')
          .insertAdjacentHTML("beforeend", `© 2026 <a href="https://waysidemapping.org" target="_blank">Quincy Morgan</a> (<a href="https://github.com/waysidemapping/themap.is/blob/main/LICENSE" target="_blank">MIT</a>)`),
      )
  );
}

updateContent();

state.addEventListener('change-themeInspectorOpen', _ => {
  if (state.themeInspectorOpen) {
    updateContent();
    document.documentElement.classList.add('themeInspectorOpen');
    themeInspector?.classList.remove('hidden');
  } else {
    document.documentElement.classList.remove('themeInspectorOpen');
    themeInspector?.classList.add('hidden');
  }
});

state.addEventListener('change-theme', updateContent);