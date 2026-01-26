import { getSvg } from './svgManager.js';
import potpack from 'https://cdn.skypack.dev/potpack';

async function rasterizeIcons(icons, scale) {
  const promises = [];
  for (let id in icons) {
    const info = icons[id];
    const url = '/icons/' + info.file + '.svg';
    const promise = getSvg(url, info)
      .then(async svgInfo => {
        let svgString = svgInfo.string;
        let canvasWidth = svgInfo.w * scale;
        let canvasHeight = svgInfo.h * scale;
        const img_1 = await new Promise((resolve, reject) => {
          const blob = new Blob([svgString], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
          };
          img.onerror = reject;
          img.src = url;
        });
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img_1, 0, 0, canvasWidth, canvasHeight);
        return {
          name: id,
          canvas: canvas,
          w: canvasWidth,
          h: canvasHeight
        };
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