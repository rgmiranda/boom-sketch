const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { range, pick, rangeFloor } = require('canvas-sketch-util/random');
const { Pane } = require('tweakpane');
const { loadImage } = require('../images');

const cvWidth = cvHeight = 1080;
const bg = 'black';
let sketchManager;

const imageUrl = 'images/gioconda.jpg'

const paneParams = {
  rows: 64,
  cols: 64,
  lightChars: '.,\'',
  mediumChars: '-',
  strongChars: '/_*+?',
}
const pane = new Pane();
pane.addInput(paneParams, 'rows', {
  min: 16,
  max: 128,
  step: 1
}).on('change', () => { 
  if (sketchManager) {
    sketchManager.render();
  }
});
pane.addInput(paneParams, 'cols', {
  min: 16,
  max: 128,
  step: 1
}).on('change', () => { 
  if (sketchManager) {
    sketchManager.render();
  }
});
pane.addInput(paneParams, 'lightChars', {
  min: 16,
  max: 128,
  step: 1
}).on('change', () => { 
  if (sketchManager) {
    sketchManager.render();
  }
});
pane.addInput(paneParams, 'mediumChars', {
  min: 16,
  max: 128,
  step: 1
}).on('change', () => { 
  if (sketchManager) {
    sketchManager.render();
  }
});
pane.addInput(paneParams, 'strongChars', {
  min: 16,
  max: 128,
  step: 1
}).on('change', () => { 
  if (sketchManager) {
    sketchManager.render();
  }
});

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

/**
 * @param { number } width 
 * @param { number } height
 * @param { HTMLImageElement } image
 * @returns { ImageData }
 */
function getGliphImageData(width, height, image) {

  /** @type { HTMLCanvasElement } */
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  /** @type { CanvasRenderingContext2D } */
  const context = canvas.getContext('2d');
  
  context.fillStyle = bg;
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

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
    return pick(paneParams.lightChars.split(''));
  }
  if (l < 100) {
    return pick(paneParams.mediumChars.split(''));
  }
  return pick(paneParams.strongChars.split(''));
}

/**
 * 
 * @param { number } r 
 * @param { number } g 
 * @param { number } b 
 * @returns { number }
 */
function getCharSize(r, g, b) {
  const l = (r + g + b) / 3;
  const maxSize = mapRange(l, 0, 255, 20, 60);
  const minSize = mapRange(l, 0, 255, 5, 10);
  return rangeFloor(minSize, maxSize);
}

const sketch = async () => {
  const { rows, cols } = paneParams;
  const image = await loadImage(imageUrl);
  const gliphData = getGliphImageData(cols, rows, image);
  return ({ context, width, height }) => {

    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    const pw = width / cols;
    const ph = height / rows;

    let x, y, charSize, r, g, b, a, char;
    for (let i = 0; i < rows * cols; i++) {  
      x = i % cols * pw;
      y = Math.floor(i / cols) * ph;
      ({r, g, b} = getPixelData(i, gliphData));
      charSize = getCharSize(r, g, b, a);
      char = getChar(r, g, b, a);
      context.fillStyle = `rgb(${r}, ${g}, ${b})`;
      context.font = `${charSize}px "Courier New"`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(char, x, y);
    }
    //context.putImageData(gliphData, 0, 0);
  };
};

canvasSketch(sketch, settings).then((manager) => sketchManager = manager);
