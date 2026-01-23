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

function rectToPath(x, y, width, height, r = 0) {
  if (r <= 0) {
    return `M${x} ${y} H${x + width} V${y + height} H${x} Z`;
  }
  
  // Clamp radius to half width/height
  r = Math.min(r, width / 2, height / 2);

  return `
    M${x + r} ${y}
    H${x + width - r}
    A${r} ${r} 0 0 1 ${x + width} ${y + r}
    V${y + height - r}
    A${r} ${r} 0 0 1 ${x + width - r} ${y + height}
    H${x + r}
    A${r} ${r} 0 0 1 ${x} ${y + height - r}
    V${y + r}
    A${r} ${r} 0 0 1 ${x + r} ${y}
    Z
  `.replace(/\s+/g, ' ').trim();
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
        let iconWidth = svgInfo.w;
        let iconHeight = svgInfo.h;
        let iconX = svgInfo.x;
        let iconY = svgInfo.y;

        if (info.stroke || info.halo) {
          // add padding since stroke and halo can be rendered outside the regular bounds
          padding = 1;
          iconWidth = svgInfo.w + padding * 2;
          iconHeight = svgInfo.h + padding * 2;
          iconX = svgInfo.x - padding;
          iconY = svgInfo.y - padding;
          string = string.replace(/ viewBox=".+?"/g, ` viewBox="${iconX} ${iconY} ${iconWidth} ${iconHeight}" `);
        }

        let fill = info.fill || "none";
        string = string.replace(/<path /g, `<path fill="${fill}" `);
        // A stroke is centered on the path
        if (info.stroke) {
          string = string.replace(/<path /g, `<path stroke="${info.stroke}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" `);
        }
        
        // A halo is just an outer stroke that we fake through a double-width stroke clipped to the inverted icon's path
        if (info.halo) {
          // use original paths here so they won't have attributes
          let iconPaths = svgInfo.string.match(/<path .+?>/g);
          let haloPathsString = iconPaths.join('').replace(/<path /g, `<path clip-path="url(#halo)" fill="none" stroke="${info.halo}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" `);
          string = string.replace(/<\/svg>/, `${haloPathsString}\n</svg>`);

          let borderD = rectToPath(iconX, iconY, iconWidth, iconHeight);
          let clipPaths = iconPaths.map(pathInner => {
            
            return pathInner
              // add the bounding box of the icon as an outer ring in order to invert the path
              .replace(/ d="/, ` d="${borderD} `)
              // invert the path
              .replace(/<path /, `<path clip-rule="evenodd" `);
          });
          string = string.replace(/<\/svg>/, `<clipPath id="halo">${clipPaths.join('')}</clipPath></svg>`);
        }
        console.log(string);

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
    return {
      "1": await getSpritesheet(icons, 1),
      "2": await getSpritesheet(icons, 2)
    };
}