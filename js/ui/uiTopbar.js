import { createElement } from "../utils.js";
import { state } from "../stateController.js";

let shareButton;

export const topbar = createElement('div')
  .setAttribute('id', 'topbar')
  .append(
    createElement('button')
      .addEventListener('click', _ => {
        const z = state.mapcenter?.z
        const lat = state.mapcenter?.lat
        const lng = state.mapcenter?.lng
        if (z && lat && lng) window.open(`https://www.openstreetmap.org/edit#map=${Math.round(z)+1}/${lat}/${lng}`, '_blank');
      })
      .append('Edit'),
    createElement('button')
      .addEventListener('click', _ => {
        window.open('https://osm411.org' + window.location.hash, '_blank');
      })
      .append('Open In'),
    createElement('div')
      .setAttribute('class', 'spacer'),
    shareButton = createElement('button')
      .addEventListener('click', _ => {
        const z = state.mapcenter?.z
        const lat = state.mapcenter?.lat
        const lng = state.mapcenter?.lng

        const themeId = state.theme?.id || '';
        // create a clean version of the URL for sharing
        let url = new URL(window.location.href);
        url.path = '/' + themeId;
        url.search = '';
        url.hash = `#map=${z}/${lat}/${lng}`;

        let urlString = url.toString();
        let data = { url: urlString };

        if (navigator.share && navigator.canShare && navigator.canShare(data)) {
          navigator.share(data);
        } else if (navigator.clipboard?.write) {
          navigator.clipboard.writeText(urlString)
            .then(_ => {
              shareButton.replaceChildren('Copied!');
              window.setTimeout(_ => {
                 shareButton.replaceChildren('Share');
              }, 2500)
            });
        }
      })
      .append('Share')
  );