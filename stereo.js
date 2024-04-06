const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const risoColors = require('riso-colors');

const seed = random.getRandomSeed();
const settings = {
  dimensions: [ 1080, 1080 ],
  name: `stereo-j-${seed}`,
};
const pixelSize = 4;
const textureWidth = 50;
let text = 'J';
const fontStyle = 'serif';
let sketchManager, drawGliph = false;;

/**
 * @param { number } width 
 * @param { number } height 
 * @returns { ImageData }
 */
function getGliphImageData(text, fontStyle, width, height) {
  /** @type { TextMetrics } */
  let mtext

  let mx, my, mw, mh;

  /** @type { HTMLCanvasElement } */
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  /** @type { CanvasRenderingContext2D } */
  const context = canvas.getContext('2d');
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  
  context.fillStyle = 'white';

  context.font = `bold ${width}px ${fontStyle}`;

  mtext = context.measureText(text);
  mw = mtext.width;
  mh = mtext.actualBoundingBoxAscent + mtext.actualBoundingBoxDescent;
  my = (height + mh) * 0.5;
  mx = (width - mw) * 0.5;
  context.fillText(text, mx, my);
  return context.getImageData(0, 0, width, height);
}

/**
 * 
 * @param { ImageData } imageData 
 * @param { number } x 
 * @param { number } y 
 * @param { number } cols 
 * @returns { number }
 */
const getBrightness = (imageData, i, j, cols) => {
  const idx = (j * cols + i) * 4;
  const r = imageData.data[idx + 0];
  const g = imageData.data[idx + 1];
  const b = imageData.data[idx + 2];
  return (r + g + b) / 3;
};

const addListeners = () => {
  window.onclick = () => {
    drawGliph = !drawGliph;
    sketchManager.render();
  };
};

const sketch = ({ width, height }) => {
  addListeners();
  random.setSeed(seed);
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);
  const gliphData = getGliphImageData(text, fontStyle, cols, rows);
  const colors = [
    random.pick(risoColors).hex,
    random.pick(risoColors).hex,
    random.pick(risoColors).hex,
    random.pick(risoColors).hex,
  ];
  /**
   * @type { string[][] }
   */
  const texture = Array(rows).fill(0).map(() => Array(textureWidth).fill(0).map(() => random.pick(colors)));
  //const texture = Array(rows).fill(0).map(() => Array(textureWidth).fill(0).map((v, i) => (i % 2) === 0 ? 'white' : 'black'));
  return ({ context }) => {
    texture.forEach((textureRow, j) => {
      const y = j * pixelSize;
      let currentTexture = [...textureRow];
      for (let i = 0; i < cols; i++) {
        const x = i * pixelSize;
        let offset;
        const b = getBrightness(gliphData, i, j, cols);
        if ( drawGliph && b !== 0 ) {
          offset = 7;
        } else {
          offset = 0;
        }
        context.fillStyle = currentTexture[(i + offset) % textureWidth];
        context.fillRect(x, y, pixelSize, pixelSize);
        currentTexture[i % textureWidth] = currentTexture[(i + offset) % textureWidth];
      }
    })
  };
};

canvasSketch(sketch, settings).then(manager => sketchManager = manager);
