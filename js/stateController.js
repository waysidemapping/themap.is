// Manages the state of the UI in a generalized sort of way.
// The various UI components can listen for state changes and
// update themselves accordingly.

class StateController extends EventTarget {

  restrictedKeys = Object.keys(this).concat(['set', 'get', 'restrictedKeys']);

  set(key, value) {
    if (this.restrictedKeys.includes(key)) {
      console.log("Trying to set restricted value of StateController :" + key);
    }
    if (this[key] !== value) {
      this[key] = value
      this.dispatchEvent(new Event('change-' + key));
      this.dispatchEvent(new Event('change'));
    }
  }

  get(key) {
    return this[key];
  }

}

export const state = new StateController();
