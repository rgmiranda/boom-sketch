const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const cvHeight = cvWidth = 1080;
let text = 'C';
let sketchManager;
const fontSize = 32;
const fontStyle = 'bold serif';
const dropNum = 2048;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
  name: 'rain-c'
};

class Drop {
  constructor() {
    this.init();
  }

  init() {
    this.vx = random.range(-1, 1);
    this.vy = random.range(5, 10);
    this.x = random.rangeFloor(0, cvWidth);
    this.y = 0;
  }

  /**
   * @param { ImageData } gliphData
   */
  update(gliphData) {
    const ix = Math.floor(math.mapRange(this.x, 0, cvWidth, 0, fontSize));
    const iy = Math.floor(math.mapRange(this.y, 0, cvHeight, 0, fontSize));
    const idx = (iy * gliphData.width + ix) * 4;
    const r = gliphData.data[idx + 0];
    const g = gliphData.data[idx + 1];
    const b = gliphData.data[idx + 2];
    if (r + g + b !== 0) {
      this.x += 0;
      this.y += this.vy * 0.4;
    } else {
      this.x += this.vx;
      this.y += this.vy;
    }

    if (this.x < 0 || this.y > cvHeight) {
      this.init();
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context
   */
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, 2, 0, Math.PI * 2);
    context.fill();
  }
}


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

/** @type { Drop[] } */
const drops = [];

const sketch = () => {
  for (let i = 0; i < dropNum; i++) {
    drops.push(new Drop());
  }

  const imageData = getGliphImageData(fontSize, fontSize)
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'white';
    drops.forEach(d => {
      d.update(imageData);
      d.draw(context);
    });
  };
};

canvasSketch(sketch, settings).then(manager => sketchManager = manager);
