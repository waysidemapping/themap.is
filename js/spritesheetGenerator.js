import potpack from 'https://cdn.skypack.dev/potpack';

const svgsByUrl = {};

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

async function getSvg(url) {
  if (!svgsByUrl[url]) {
    svgsByUrl[url] = fetch(url)
      .then(resp => resp.text())
      .then(svgString => {
        const svgInfo = getSvgDimensions(svgString);
        svgInfo.url = url;
        svgInfo.string = svgString;
        return svgInfo;
      });
  }
  return svgsByUrl[url];
}

function rectToPath(x, y, width, height) {
  return `M${x} ${y} H${x + width} V${y + height} H${x} Z`;
}

async function rasterizeIcons(icons, scale) {
  const promises = [];
  for (let id in icons) {
    const info = icons[id];
    const url = '/icons/' + info.file + '.svg';
    const promise = getSvg(url)
      .then(svgInfo => {
        let string = svgInfo.string;

        let padding = 0;
        if (info.bg_fill) {
          // leave enough margin to look visually nice
          padding = 2;
        } else if (info.stroke || info.halo) {
          // stroke and halo can be rendered outside the regular bounds
          padding = 1;
        }

        const iconWidth = svgInfo.w + padding * 2;
        const iconHeight = svgInfo.h + padding * 2;
        const iconX = svgInfo.x - padding;
        const iconY = svgInfo.y - padding;
        string = string.replace(/ viewBox=".+?"/g, ` viewBox="${iconX} ${iconY} ${iconWidth} ${iconHeight}" `);

        let fill = info.fill || "none";
        string = string.replace(/<path /g, `<path fill="${fill}" `);
        // A stroke is centered on the path
        if (info.stroke) {
          string = string.replace(/<path /g, `<path stroke="${info.stroke}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" `);
        }
        
        // A halo is just an outer stroke that we fake through a double-width stroke clipped to the inverted icon's path
        if (info.halo) {
          // use original paths here so they won't have attributes
          const iconPaths = svgInfo.string.match(/<path .+?>/g);
          const haloPathsString = iconPaths.join('').replace(/<path /g, `<path clip-path="url(#halo)" fill="none" stroke="${info.halo}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" `);
          string = string.replace(/<\/svg>/, `${haloPathsString}\n</svg>`);

          const borderD = rectToPath(iconX, iconY, iconWidth, iconHeight);
          const allPathsD = [...iconPaths.join('').matchAll(/<path\b[^>]*\bd="([^"]*)"/gi)].map(match => match[1]).join(' ');
           // we need to collapse all the paths, plus the border, into a single path in order for the clip-rule to work
          const clipPathInnerString = `<path clip-rule="evenodd" d="${borderD} ${allPathsD}"/>`;
          string = string.replace(/<\/svg>/, `<clipPath id="halo">${clipPathInnerString}</clipPath></svg>`);
        }
        if (info.bg_fill) {
          let bgRect = `<rect x="${iconX}" y="${iconY}" width="${iconWidth}" height="${iconHeight}" rx="2" fill="${info.bg_fill}"/>`;
          string = string.replace(/(<svg\b[^>]*>)/i, `$1\\${bgRect}`);
        }

        let canvasWidth = iconWidth * scale;
        let canvasHeight = iconHeight * scale;
        return new Promise((resolve, reject) => {
          const blob = new Blob([string], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
          };
          img.onerror = reject;
          img.src = url;
        })
        .then(img => {
          const canvas = document.createElement('canvas');
          
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          return {
            name: id,
            canvas: canvas,
            w: canvasWidth,
            h: canvasHeight
          };
        });
      });
    promises.push(promise);
  }
  return await Promise.all(promises);
}

function renderSpritesheet(rects, width, height, scale) {
  const png = document.createElement('canvas');
  png.width = width;
  png.height = height;

  const ctx = png.getContext('2d');

  const json = {};

  for (const r of rects) {
    ctx.drawImage(r.canvas, r.x, r.y);

    json[r.name] = {
      x: r.x,
      y: r.y,
      width: r.w,
      height: r.h,
      pixelRatio: scale
    };
  }

  return { png: png, json: json };
}

async function getSpritesheet(icons, scale) {
  const pngIcons = await rasterizeIcons(icons, scale);
  const spritesheetSize = potpack(pngIcons);
  const spritesheet = renderSpritesheet(pngIcons, spritesheetSize.w, spritesheetSize.h, scale);
  const pngUrl = await new Promise(resolve => {
    spritesheet.png.toBlob(blob => {
      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
  const jsonUrl = URL.createObjectURL(
    new Blob([JSON.stringify(spritesheet.json)], { type: 'application/json' })
  );
  return { pngUrl: pngUrl, jsonUrl: jsonUrl };
}

export async function getSpritesheets(icons) {
  if (icons && Object.keys(icons).length) {
    return {
      "1": await getSpritesheet(icons, 1),
      "2": await getSpritesheet(icons, 2)
    };
  }
}