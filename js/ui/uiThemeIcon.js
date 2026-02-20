import { createElement } from "../utils.js";
import { getSvg } from "../svgManager.js";

const parser = new DOMParser();
export async function themeIconElement(theme, scale = 1.3) {
  const themeIconSvg = (await getSvg({file: theme?.icon || "map_pin_with_dot", fill: theme?.primaryColor, halo: "#fff", alignY: "bottom"}));
  return createElement('div')
    .setAttribute('style', `position: relative;margin-top: -${4*scale}px;font-size: ${1.2*scale}em;`)
    .append(
      parser.parseFromString(`
        <svg style="color:var(--primary-color);width:${23*scale}px;height:${23*scale}px;display:block;" width="23px" height="23px" viewBox="0 0 23 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <polygon stroke="currentColor" fill="none" points="3.5 16 7.5 14.5 11.5 15.5 15.5 14.5 19.5 16 21.5 22.5 17 20.5 11.5 22.5 6 20.5 1.5 22.5"></polygon>
        </svg>
      `, "image/svg+xml").documentElement,
      createElement('img')
        .setAttribute('style', `width:${themeIconSvg.w*scale}px;height:${themeIconSvg.h*scale}px;position: absolute;top:${3*scale}px;left:${3*scale}px;`)
        .setAttribute('src', `data:image/svg+xml;utf8,${encodeURIComponent(themeIconSvg.string)}`),
    );
}
     