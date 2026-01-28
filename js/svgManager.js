const promisesByUrl = {};

function getSvgForUrl(url) {
  if (!promisesByUrl[url]) {
    promisesByUrl[url] = fetch(url)
      .then(resp => resp.text())
      .then(svgString => {
        const svgInfo = getSvgDimensions(svgString);
        svgInfo.string = svgString;
        return svgInfo;
      });
  }
  return promisesByUrl[url];
}

export function getSvg(url, opts) {
  return getSvgForUrl(url)
    .then(svgInfo => {
      if (opts) {
        return tintSvg(svgInfo.string, opts);
      }
      return Object.assign({}, svgInfo);
    });
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

function tintSvg(svgString, opts) {
  let string = svgString;
  let {x, y, w, h} = getSvgDimensions(svgString);

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
  string = string.replace(/ viewBox=".+?"/g, ` viewBox="${x} ${y} ${w} ${h}" `);

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
    const allPathsD = [...iconPaths.join('').matchAll(/<path\b[^>]*\bd="([^"]*)"/gi)].map(match => match[1]).join(' ');
      // we need to collapse all the paths, plus the border, into a single path in order for the clip-rule to work
    const clipPathInnerString = `<path clip-rule="evenodd" d="${borderD} ${allPathsD}"/>`;
    string = string.replace(/<\/svg>/, `<clipPath id="halo">${clipPathInnerString}</clipPath></svg>`);
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