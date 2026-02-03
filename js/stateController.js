// Manages the state of the UI in a generalized sort of way.
// The various UI components can listen for state changes and
// update themselves accordingly.

class StateController extends EventTarget {

  restrictedKeys = Object.keys(this).concat(['set', 'get', 'toggle', 'restrictedKeys']);

  set(obj, value) {
    if (typeof obj === 'string') {
      let key = obj;
      obj = {};
      obj[key] = value;
    }
    let didChangeAny = false;
    for (let key in obj) {
      let value = obj[key];
      if (this.restrictedKeys.includes(key)) {
        console.log("Trying to set restricted value of StateController :" + key);
      }
      if (this[key] !== value) {
        if (typeof this[key] !== 'object' ||
            typeof value !== 'object' ||
            // we want two objects with the same values in the same order to evaluate the same
            JSON.stringify(this[key]) !== JSON.stringify(value)) {
          this[key] = value
          this.dispatchEvent(new Event('change-' + key));
          didChangeAny = true;
        }
      }
    }
    if (didChangeAny) {
      this.dispatchEvent(new Event('change'));
    }
  }

  toggle(key) {
    if (this[key]) {
      this.set(key, false);
    } else{
      this.set(key, true);
    }
  }

  get(key) {
    return this[key];
  }

}

export const state = new StateController();
