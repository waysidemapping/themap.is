
// Creates a new HTML element where certain functions return the element itself.
export function createElement(...args) {
  let el = document.createElement(...args);
  wrapElementFunctions(el);
  return el;
}

// Gets an HTML element where certain functions return the element itself.
export function getElementById(...args) {
  let el = document.getElementById(...args);
  if (el) wrapElementFunctions(el);
  return el;
}

export function getElementsByName(...args) {
  let els = document.getElementsByName(...args);
  if (els) return els.map(wrapElementFunctions);
}

// Wraps certain functions of the element so they return the
// element itself in order to enable chaining.
function wrapElementFunctions(el) {
  let fnNames = ['addEventListener', 'append', 'appendChild', 'replaceChildren', 'setAttribute'];
  for (let i in fnNames) {
    let fnName = fnNames[i];
    let fn = el[fnName];
    el[fnName] = function(...args) {
      fn.apply(this, args);
      return el;
    };
  }
}

// From ISC-licensed file:
// https://github.com/openstreetmap/iD/blob/a3990df0af8582172c3d2821b1f6441206fb6c78/modules/util/util.js#L490
export function editDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  var matrix = [];
  var i, j;
  for (i = 0; i <= b.length; i++) { matrix[i] = [i]; }
  for (j = 0; j <= a.length; j++) { matrix[0][j] = j; }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i-1) === a.charAt(j-1)) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
          Math.min(matrix[i][j-1] + 1, // insertion
          matrix[i-1][j] + 1)); // deletion
      }
    }
  }
  return matrix[b.length][a.length];
}