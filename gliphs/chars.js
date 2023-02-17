const canvasSketch = require('canvas-sketch');
const { clamp } = require('canvas-sketch-util/math');
const { range, pick, rangeFloor } = require('canvas-sketch-util/random');

const cvWidth = cvHeight = 1080;

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

const text = 'A';
const fontSize = 1200;
const fontStyle = 'bold serif';
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*-/+-_?=&%$)([]{}<>#'.split('');

/**
 * @param { number *} width 
 * @param { number *} height 
 * @returns { ImageData }
 */
function getGliphImageData(width, height) {
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

  mtext = context.measureText(text);
  mw = mtext.width;
  mh = mtext.actualBoundingBoxAscent + mtext.actualBoundingBoxDescent;
  my = (height + mh) * 0.5;
  mx = (width - mw) * 0.5;
  context.fillText(text, mx, my);
  return context.getImageData(0, 0, width, height);
}

const sketch = ({ width, height }) => {
  const gliphData = getGliphImageData(width, height);
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    //context.putImageData(gliphData, 0, 0);
    let x, y, charSize, r, g, b, idx, char;
    for (let i = 0; i < 2048; i++) {  
      charSize = range(10, 100);
      char = pick(chars);
      x = rangeFloor(0, width);
      y = rangeFloor(0, height);
      idx = (y * width + x) * 4;
      r = gliphData.data[idx + 0];
      g = gliphData.data[idx + 1];
      b = gliphData.data[idx + 2];
      context.fillStyle = `rgb(${r}, ${g}, ${b})`;
      context.font = `${charSize}px monospace`;
      context.fillText(char, x, y);
    }
  };
};

canvasSketch(sketch, settings);
