import { getElementById } from "../utils.js";
import { state } from "../stateController.js";
import { header } from "./uiHeader.js";
import { topbar } from "./uiTopbar.js";

state.addEventListener('change-theme', updateUi);
getElementById('ui').replaceChildren(header, topbar);
updateUi();

function updateUi () {

  let themeColor = state.theme?.primaryColor;
  if (themeColor) {
    getElementById('ui').style.setProperty("--primary-color", themeColor);
  } else {
    getElementById('ui').style.removeProperty("--primary-color");
  }
}
