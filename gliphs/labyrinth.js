const canvasSketch = require('canvas-sketch');
const color = require('canvas-sketch-util/color');

const cvWidth = cvHeight = 1080;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name: 'labyrinth'
};

let text = 'D';
let sketchManager;
const pixelSize = 20;
const padding = pixelSize;
const fontStyle = 'bold serif';
const cols = (cvWidth - 2 * padding) / pixelSize;
const rows = (cvHeight - 2 * padding) / pixelSize;

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

  context.font = `${width}px ${fontStyle}`;
  context.fillStyle = 'white';

  mtext = context.measureText(text);
  mw = mtext.width;
  mh = mtext.actualBoundingBoxAscent + mtext.actualBoundingBoxDescent;
  my = (height + mh) * 0.5;
  mx = (width - mw) * 0.5;
  context.fillText(text, mx, my);
  return context.getImageData(0, 0, width, height);
}

function addListeners() {
  window.addEventListener('keyup', (ev) => {
    text = ev.key.toUpperCase();
    sketchManager.render();
  });
}

const sketch = () => {
  addListeners();
  const gliphData = getGliphImageData(text, fontStyle, cols, rows);
  return ({ context, width, height }) => {
    
    let idx, x, y, r, g, b;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'white';
    context.lineWidth = 4;
    
    for (let j = 0; j < rows; j++) {
      y = j * pixelSize + padding;
      for (let i = 0; i < cols; i++) {
        x = i * pixelSize + padding;
        idx = (j * cols + i) * 4;
        r = gliphData.data[idx + 0];
        g = gliphData.data[idx + 1];
        b = gliphData.data[idx + 2];

        context.save();
        context.translate(x, y);
        if (r + g + b !== 0) {
          context.beginPath();
          context.moveTo(pixelSize * 0.5, 0);
          context.lineTo(0, pixelSize * 0.5);
          context.stroke();

          context.beginPath();
          context.moveTo(pixelSize, pixelSize * 0.5);
          context.lineTo(pixelSize * 0.5, pixelSize);
          context.stroke();
        } else {
          context.beginPath();
          context.moveTo(pixelSize * 0.5, 0);
          context.lineTo(pixelSize, pixelSize * 0.5);
          context.stroke();

          context.beginPath();
          context.moveTo(0, pixelSize * 0.5);
          context.lineTo(pixelSize * 0.5, pixelSize);
          context.stroke();
        }
        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings).then(manager => sketchManager = manager);
