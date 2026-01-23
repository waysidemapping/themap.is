import potpack from 'https://cdn.skypack.dev/potpack';

const svgsByUrl = {};

function getSvgSize(svgString) {
  const size = { w: null, h: null };
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
        const svgInfo = getSvgSize(svgString);
        svgInfo.url = url;
        svgInfo.def = svgString;
        return svgInfo;
      });
  }
  return svgsByUrl[url];
}

async function rasterizeIcons(iconNames, scale) {
  const promises = [];
  for (let i in iconNames) {
    const name = iconNames[i];
    const url = '/icons/' + name + '.svg';
    const promise = getSvg(url)
      .then(svgInfo => {
        let string = svgInfo.def.replace(/currentColor/g, "#00aaff");
        let width = svgInfo.w * scale;
        let height = svgInfo.h * scale;
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
          
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          return {
            name: name,
            canvas: canvas,
            w: width,
            h: height
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

export async function getSpritesheets() {
    const icons = [];
    return {
      "1": await getSpritesheet(icons, 1),
      "2": await getSpritesheet(icons, 2)
    };
}