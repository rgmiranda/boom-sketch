const canvasSketch = require('canvas-sketch');
const { mapRange, clamp } = require('canvas-sketch-util/math');
const { getRandomSeed, setSeed, chance, range } = require('canvas-sketch-util/random');
const { getGliphImageData, getDataBrightness } = require('../images');
const createColormap = require('colormap');

const seed = getRandomSeed();
setSeed(seed);

const text = 'Q';
const lineWidth = 1;
const splitProbability = 0.65;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `gliph-cobblestones-${seed}- ${text}`
};

const colors = createColormap({
  colormap: 'plasma',
  nshades: 24
});

/**
 * 
 * @param { Uint8ClampedArray } imgBrightness 
 * @param { number } imgWidth 
 * @param { number } imgHeight 
 * @param { number } x 
 * @param { number } y 
 * @param { number } w 
 * @param { number } h 
 */
const getAvgBrightness = (imgBrightness, imgWidth, imgHeight, x, y, w, h) => {
  let counter = 0;
  let totalBrightness = 0;
  x = Math.floor(x);
  y = Math.floor(y);
  for (let j = 0; j < h; j++) {
    if (y + j >= imgHeight) {
      continue;
    }
    for (let i = 0; i < w; i++) {
      if (x + i >= imgWidth) {
        continue;
      }
      const idx = (y + j) * imgWidth + x + i;
      totalBrightness += imgBrightness[idx];
      counter++;
    }
  }
  return totalBrightness / counter;
}

/**
 * 
 * @param { number } runs 
 * @param { number } width 
 * @param { number } height 
 * @returns { {x: number, y: number, w: number, h: number}[] }
 */
const generateStones = (runs, width, height) => {
  const initSplits = 2;
  /** @type { {x: number, y: number, w: number, h: number}[] } */
  const stones = [];
  let y = 0;
  const w = width / initSplits
  const h = height / initSplits
  for (let j = 0; j < initSplits; j++) {
    let x = 0;
    for (let i = 0; i < initSplits; i++) {
      const r = range(Math.min(w, h) * 0.1, Math.min(w, h) * 0.35);
      stones.push({
        x, y, w, h, r
      })
      x += width / initSplits;
    }
    y += height / initSplits;
  }
  for (let i = 0; i < runs; i++) {
    for (let j = stones.length - 1; j >= 0; j--) {
      const stone = stones[j];
      if (!chance(splitProbability)) {
        continue;
      }
      let x, y, w, h;
      if (stone.w === stone.h) {
        if (chance(0.5)) {
          x = stone.x + stone.w * 0.5;
          y = stone.y;
          w = stone.w * 0.5;
          h = stone.h;
          stone.w *= 0.5;
        } else {
          x = stone.x;
          y = stone.y + stone.h * 0.5;
          w = stone.w;
          h = stone.h * 0.5;
          stone.h *= 0.5;
        }
      } else if (stone.w > stone.h) {
        x = stone.x + stone.w * 0.5;
        y = stone.y;
        w = stone.w * 0.5;
        h = stone.h;
        stone.w *= 0.5;
      } else {
        x = stone.x;
        y = stone.y + stone.h * 0.5;
        w = stone.w;
        h = stone.h * 0.5;
        stone.h *= 0.5;
      }
      stone.r *= 0.5;
      const r = range(Math.min(w, h) * 0.1, Math.min(w, h) * 0.35);
      stones.push({ x, y, w, h, r });
    }
  }
  return stones;
};

const sketch = ({ width, height }) => {
  const gliphData = getGliphImageData(text, 'monospace', width, height, 'white', 'black', 10);
  const stones = generateStones(8, width, height, gliphData);
  const imgBrightness = getDataBrightness(gliphData);

  return (
    /**
     * @param {{ context: CanvasRenderingContext2D, width: number, height: number }} 
     */
    ({ context }) => {
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);
      context.fillStyle = 'black';
      context.lineWidth = lineWidth;
      stones.forEach(({ x, y, w, h, r }) => {
        const b = getAvgBrightness(imgBrightness, width, height, x, y, w, h);
        const colorIdx = Math.floor(mapRange(b, 0, 255, 0, colors.length - 1));
        x += lineWidth * 0.5;
        y += lineWidth * 0.5;
        h -= lineWidth;
        w -= lineWidth;
        context.beginPath();
        context.moveTo(x + r, y);
        context.lineTo(x + w - r, y);
        context.arcTo(x + w, y, x + w, y + h - r, r);
        context.lineTo(x + w, y + h - r);
        context.arcTo(x + w, y + h, x + w - r, y + h, r);
        context.lineTo(x + r, y + h);
        context.arcTo(x, y + h, x, y + h - r, r);
        context.lineTo(x, y + r);
        context.arcTo(x, y, x + r, y, r);
        context.closePath();
        context.fillStyle = colors.at(colorIdx);
        context.fill();
      });
      //context.putImageData(gliphData, 0, 0);
    });
};

canvasSketch(sketch, settings);
