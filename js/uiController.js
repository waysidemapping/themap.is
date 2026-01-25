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
              .append(state.theme?.name)
          )
      )
  );

}