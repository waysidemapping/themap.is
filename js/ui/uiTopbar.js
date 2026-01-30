import { createElement } from "../utils.js";
import { state } from "../stateController.js";
import { getSvg } from "../svgManager.js";

let shareButtonLabel;

export const topbar = createElement('div')
  .setAttribute('id', 'topbar')
  .append(
    createElement('div')
      .setAttribute('class', 'button-group')
      .append(
        createElement('button')
          .addEventListener('click', _ => {
            const z = state.mapcenter?.z
            const lat = state.mapcenter?.lat
            const lng = state.mapcenter?.lng
            if (z && lat && lng) window.open(`https://www.openstreetmap.org/edit#map=${Math.round(z)+1}/${lat}/${lng}`, '_blank');
          })
          .append(
            createElement('div')
              .setAttribute('class', 'icon')
              .setAttribute('style', "width:12px;height:12px;")
              .append(
                new DOMParser().parseFromString((await getSvg({file: 'pencil-square', fill: 'currentColor'})).string, "image/svg+xml").documentElement
              ),
            createElement('span')
              .append('Edit')
          ),
        createElement('button')
          .addEventListener('click', _ => {
            window.open('https://osm411.org' + window.location.hash, '_blank');
          })
          .append(
            createElement('div')
              .setAttribute('class', 'icon')
              .setAttribute('style', "width:12px;height:12px;")
              .append(
                new DOMParser().parseFromString((await getSvg({file: 'arrow_top_right-square', fill: 'currentColor'})).string, "image/svg+xml").documentElement
              ),
            createElement('span')
              .append('Open In…')
          )
      ),
    createElement('div')
      .setAttribute('class', 'spacer'),
    createElement('button')
      .addEventListener('click', _ => {
        const z = state.mapcenter?.z;
        const lat = state.mapcenter?.lat;
        const lng = state.mapcenter?.lng;

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
              shareButtonLabel.replaceChildren('Link Copied!');
              window.setTimeout(_ => {
                 shareButtonLabel.replaceChildren('Share');
              }, 3000)
            });
        }
      })
      .append(
        createElement('div')
          .setAttribute('class', 'icon')
          .setAttribute('style', "width:12px;height:12px;")
          .append(
            new DOMParser().parseFromString((await getSvg({file: 'arrow_up-rect', fill: 'currentColor'})).string, "image/svg+xml").documentElement
          ),
        shareButtonLabel = createElement('span')
              .append('Share')
        )
  );