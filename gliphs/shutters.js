const canvasSketch = require('canvas-sketch');

const cvWidth = cvHeight = 1080;

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

let text = 'B';
let sketchManager;
const rows = 32;
const cols = 32;
const padding = 10;
const minShutterHeight = 1;
const pw = (cvWidth - padding) / cols;
const ph = (cvHeight - padding) / rows;
const fontSize = cols;
const fontStyle = 'bold serif';

/**
 * @param { number } width 
 * @param { number } height 
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

function getShutterHeight(r, g, b) {
  return (r + g + b) === 0 ? minShutterHeight : ph - padding;
}

function addListeners() {
  window.addEventListener('keyup', (ev) => {
    text = ev.key.toUpperCase();
    sketchManager.render();
  });
}

const sketch = () => {
  addListeners();
  return ({ context, width, height }) => {
    const gliphData = getGliphImageData(cols, rows);
    
    let idx, x, y, r, g, b, sh, px, py;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    for (let j = 0; j < rows; j++) {
      y = j * ph + ph - padding;
      
      context.save();
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(0, y - minShutterHeight);
      px = 0;
      py = y - minShutterHeight;

      for (let i = 0; i < cols; i++) {
        x = i * pw + pw * 0.5;
        idx = j * cols + i;
        r = gliphData.data[idx * 4 + 0];
        g = gliphData.data[idx * 4 + 1];
        b = gliphData.data[idx * 4 + 2];
        sh = getShutterHeight(r, g, b);
        if (y - sh !== py) {
          context.bezierCurveTo(x, py, px, y - sh, x, y - sh);
        } else {
          context.lineTo(x, y - sh);
        }
        px = x;
        py = y - sh;
      }
      context.lineTo(width, y - minShutterHeight);
      context.lineTo(width, y);
      context.closePath();

      context.fillStyle = '#CCC';
      context.fill();
      
      context.restore();
    }
    //context.putImageData(gliphData, 0, 0);
  };
};

canvasSketch(sketch, settings).then(manager => sketchManager = manager);
