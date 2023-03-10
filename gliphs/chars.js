const canvasSketch = require('canvas-sketch');
const { range, pick } = require('canvas-sketch-util/random');
const { Pane } = require('tweakpane');

const cvWidth = cvHeight = 1080;
let sketchManager;

const paneParams = {
  rows: 48,
  cols: 48,
  text: 'π'
}
const pane = new Pane();
pane.addInput(paneParams, 'rows', {
  min: 16,
  max: 64,
  step: 1
}).on('change', () => { 
  if (sketchManager) {
    sketchManager.render();
  }
});
pane.addInput(paneParams, 'cols', {
  min: 16,
  max: 64,
  step: 1
}).on('change', () => { 
  if (sketchManager) {
    sketchManager.render();
  }
});
pane.addInput(paneParams, 'text').on('change', () => { 
  if (sketchManager) {
    sketchManager.render();
  }
});

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

const ligthChars = '.,\'"'.split('');
const mediumChars = '-'.split('')
const strongChars = '0123456789'.split('');

/**
 * @param { number } width 
 * @param { number } height
 * @param { string } text
 * @returns { ImageData }
 */
function getGliphImageData(width, height, text) {
  const fontSize = width;
  const fontStyle = 'bold serif';

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

/**
 * 
 * @param { number } i 
 * @param { ImageData } imageData 
 * @returns { { r: number, g: number, b: number, a: number } }
 */
function getPixelData(i, imageData) {
  const idx = i * 4;
  const r = imageData.data[idx + 0];
  const g = imageData.data[idx + 1];
  const b = imageData.data[idx + 2];
  const a = imageData.data[idx + 3];
  return { r, g, b, a };
}

/**
 * 
 * @param { number } r 
 * @param { number } g 
 * @param { number } b 
 * @returns { string }
 */
function getChar(r, g, b) {
  const l = (r + g + b) / 3;
  if (l < 50) {
    return pick(ligthChars);
  }
  if (l < 150) {
    return pick(mediumChars);
  }
  return pick(strongChars);
}

const sketch = () => {
  return ({ context, width, height }) => {
    const { rows, cols, text } = paneParams;

    const pw = cvWidth / cols;
    const ph = cvHeight / rows;

    let x, y, charSize, r, g, b, char;
    const gliphData = getGliphImageData(cols, rows, text);

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    for (let i = 0; i < rows * cols; i++) {  
      x = i % cols * pw;
      y = Math.floor(i / cols) * ph;
      charSize = range(10, 75);
      ({r, g, b} = getPixelData(i, gliphData));
      char = getChar(r, g, b);
      context.fillStyle = `rgb(${r}, ${g}, ${b})`;
      context.font = `${charSize}px monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(char, x, y);
    }
    //context.putImageData(gliphData, 0, 0);
  };
};

canvasSketch(sketch, settings).then((manager) => sketchManager = manager);
