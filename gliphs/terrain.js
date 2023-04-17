const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { noise2D, rangeFloor, noise1D, getRandomSeed, setSeed } = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const eases = require('eases');

const seed = getRandomSeed();
setSeed(seed);

const text = 'E';
const pixelSize = 2;
const fontStyle = 'serif';

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `terrain-${seed}`
};

/**
 * @param { string } text
 * @param { number } width
 * @param { number } height
 * @returns { ImageData }
 */
function getGliphImageData(text, fontSize, fontStyle, width, height) {
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

  context.font = `${fontSize}px ${fontStyle}`;
  context.fillStyle = 'white';
  context.filter = 'blur(15px)';

  mtext = context.measureText(text);
  mw = mtext.width;
  mh = mtext.actualBoundingBoxAscent + mtext.actualBoundingBoxDescent;
  my = (height + mh) * 0.5;
  mx = (width - mw) * 0.5;
  context.fillText(text, mx, my);
  return context.getImageData(0, 0, width, height);
}

const lines = [];

const sketch = ({ width, height }) => {
  const numLines = 64;
  const numPoints = 1080;
  let linePadding = height / (numLines + 1);
  const pointPadding = width / (numPoints - 1);
  const fontSize = width / pixelSize;
  const pxWidth = width / pixelSize;
  const pxHeight = height / pixelSize;


  const gliphData = getGliphImageData(text, fontSize, fontStyle, pxWidth, pxHeight);

  for (let i = 0; i < numLines; i++) {
    const ii = Math.floor(mapRange(i, 0, numLines - 1, 0, pxHeight - 1));
    const line = [];
    let offset;
    for (let j = 0; j < numPoints; j++) {
      const ij = Math.floor(mapRange(j, 0, numPoints - 1, 0, pxWidth - 1));
      const idx = (ii * pxWidth + ij) * 4;
      const r = gliphData.data[idx + 0];
      const g = gliphData.data[idx + 1];
      const b = gliphData.data[idx + 2];
      offset = (r + g + b) / 6;
      line.push([j * pointPadding, ( i + 1 ) * linePadding - offset]);
    }
    lines.push(line);
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'white';
    context.lineWidth = 1;

    for (let i = 0; i < numLines; i++) {
      let x, y;
      context.beginPath();
      ([x, y] = lines[i][0])
      context.moveTo(x, y);
      for (let j = 1; j < numPoints; j++) {
        ([x, y] = lines[i][j])
        context.lineTo(x, y);
      }
      context.strokeStyle = 'white';
      context.lineWidth = 4;
      context.stroke();
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();
      context.fill();
      //context.putImageData(gliphData, 0, 0);
    }
  };
};

canvasSketch(sketch, settings);
