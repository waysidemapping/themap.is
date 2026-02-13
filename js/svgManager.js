
// Cache promises since both fetching and building hundreds of icons multiples times
// can affect performances. These are separate steps since multiple built SVGs can
// reference the same base file.
const fetchPromisesByUrl = {};
const buildPromisesById = {};

const optsById = {};

const emptyIconInfo = {
  x: 0, y: 0, w: 15, h: 15,
  string: `<?xml version="1.0" encoding="UTF-8"?><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 15 15"></svg>`
};

export function registerSvg(opts) {
  let id = opts.file || '';
  if (opts.fill === 'none') delete opts.fill; // sense check
  if (opts.fill) {
    opts.fill = opts.fill.toLowerCase().trim();
    id += ' f-' + opts.fill;
  }
  if (opts.stroke) {
    opts.stroke = opts.stroke.toLowerCase().trim();
    id += ' s-' + opts.stroke;
  }
  if (opts.halo) {
    opts.halo = opts.halo.toLowerCase().trim();
    id += ' h-' + opts.halo;
  }
  if (opts.bg_fill) {
    opts.bg_fill = opts.bg_fill.toLowerCase().trim();
    id += ' bg-' + opts.bg_fill;
  }
  if (opts.alignX) {
    opts.alignX = opts.alignX.toLowerCase().trim();
    id += ' ax-' + opts.alignX;
  }
  if (opts.alignY) {
    opts.alignY = opts.alignY.toLowerCase().trim();
    id += ' ay-' + opts.alignY;
  }
  if (!optsById[id]) optsById[id] = opts;
  return id;
}

function fetchSvgFile(file) {
  if (!fetchPromisesByUrl[file]) {
    fetchPromisesByUrl[file] = file ? fetch('/dist/icons/' + file + '.svg')
      .then(resp => resp.text())
      .then(svgString => {
        const svgInfo = getSvgDimensions(svgString);
        svgInfo.string = svgString;
        return svgInfo;
      }) : Promise.resolve(emptyIconInfo);
  }
  return fetchPromisesByUrl[file];
}

export function getSvg(idOrOpts) {
  const opts = typeof idOrOpts === 'string' ? optsById[idOrOpts] : idOrOpts;
  const id = typeof idOrOpts === 'string' ? idOrOpts : registerSvg(opts);
  if (!buildPromisesById[id]) {
    buildPromisesById[id] = fetchSvgFile(opts.file)
      .then(svgInfo => buildSvg(svgInfo.string, opts));
  }
  return buildPromisesById[id];
}

function getSvgDimensions(svgString) {
  const size = { x: 0, y: 0, w: null, h: null };
  const widthMatch = svgString.match(
    /<svg[^>]*\bwidth\s*=\s*["']([\d.]+)(?:px)?["']/i
  );
  if (widthMatch) size.w = parseFloat(widthMatch[1]);
  const heightMatch = svgString.match(
    /<svg[^>]*\bheight\s*=\s*["']([\d.]+)(?:px)?["']/i
  );
  if (heightMatch) size.h = parseFloat(heightMatch[1]);

  // Fallback to viewBox if needed
  if (size.w === null || size.h === null) {
    const viewBoxMatch = svgString.match(
      /<svg[^>]*\bviewBox\s*=\s*["']([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)["']/i
    );
    if (viewBoxMatch) {
      size.x = parseFloat(viewBoxMatch[1]);
      size.y = parseFloat(viewBoxMatch[2]);
      size.w = parseFloat(viewBoxMatch[3]);
      size.h = parseFloat(viewBoxMatch[4]);
    }
  }
  return size;
}

function buildSvg(svgString, opts) {
  let string = svgString;
  let {x, y, w, h} = getSvgDimensions(svgString);

  let viewBoxOffsetY = 0;
  let viewBoxOffsetX = 0;

  if (opts.alignX || opts.alignY) {
    let pathBounds = getSvgPathBounds(svgString);
    if (opts.alignX === 'right') {
      viewBoxOffsetX = pathBounds.maxX - w;
    } else if (opts.alignX === 'left') {
      viewBoxOffsetX = pathBounds.minX;
    }
    if (opts.alignY === 'bottom') {
      viewBoxOffsetY = pathBounds.maxY - h;
    } else if (opts.alignY === 'top') {
      viewBoxOffsetY = pathBounds.minY;
    }
  }

  let padding = 0;
  if (opts.bg_fill) {
    // leave enough margin to look visually nice
    padding = 2;
  } else if (opts.stroke || opts.halo) {
    // stroke and halo can be rendered outside the regular bounds
    padding = 1;
  }
  w = w + padding * 2;
  h = h + padding * 2;
  x = x - padding;
  y = y - padding;
  string = string.replace(/ viewBox=".+?"/g, ` viewBox="${x + viewBoxOffsetX} ${y + viewBoxOffsetY} ${w} ${h}" `);

  let fill = opts.fill || "none";
  string = string.replace(/<path /g, `<path fill="${fill}" `);
  // A stroke is centered on the path
  if (opts.stroke) {
    string = string.replace(/<path /g, `<path stroke="${opts.stroke}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" `);
  }
  
  // A halo is just an outer stroke that we fake through a double-width stroke clipped to the inverted icon's path
  if (opts.halo) {
    // use original paths here so they won't have attributes
    const iconPaths = svgString.match(/<path .+?>/g);
    const haloPathsString = iconPaths.join('').replace(/<path /g, `<path clip-path="url(#halo)" fill="none" stroke="${opts.halo}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" `);
    string = string.replace(/<\/svg>/, `${haloPathsString}\n</svg>`);

    const borderD = rectToPath(x, y, w, h);
    const allPathsDs = [...iconPaths.join('').matchAll(/<path\b[^>]*\bd="([^"]*)"/gi)].map(match => match[1]);
    
    // Collapse all the paths, plus the border, into a single path in order for the clip-rule to work
    const clipPathInnerString = `<path clip-rule="evenodd" d="${borderD} ${allPathsDs.join('')}"/>`;
    string = string.replace(/<\/svg>/, `<clipPath id="halo">${clipPathInnerString}</clipPath></svg>`);

    // Fill in any inner rings with the halo color, with the assumption that we don't want a "windowframe" effect
    const allDRings = allPathsDs.map(d => d.match(/M[\s\S]*?Z/gi) || []).flat();
    const occlusionPaths = allDRings.map(d => `<path fill="${opts.halo}" d="${d}"/>`).join('\n');
    string = string.replace(/(<svg\b[^>]*>)/i, `$1\n${occlusionPaths}`);
  }
  if (opts.bg_fill) {
    let bgRect = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${opts.bg_fill}"/>`;
    string = string.replace(/(<svg\b[^>]*>)/i, `$1\n${bgRect}`);
  }
  return {
    x: x,
    y: y,
    w: w,
    h: h,
    string: string
  };
}

function rectToPath(x, y, width, height) {
  return `M${x} ${y} H${x + width} V${y + height} H${x} Z`;
}

function getSvgPathBounds(svgString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svg = doc.documentElement;

  // we need to add the element to the DOM so getBBox works, but make sure it's hidden
  svg.style.position = "absolute";
  svg.style.visibility = "hidden";
  document.body.appendChild(svg);

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  svg.querySelectorAll("path").forEach(path => {
    const { x, y, width, height } = path.getBBox();
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });
  document.body.removeChild(svg);
  return {minX, minY, maxX, maxY};
}