const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'k-switch'
};

const pixelSize = 20;
const text = 'K';
const fontStyle = 'serif';
const baseP = 0.1;


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

class Switch {
  /**
   * 
   * @param { number } x 
   * @param { number } y 
   * @param { number } size 
   * @param { number } p 
   */
  constructor (x, y, size, p) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.p = p;
    this.totalDelta = 0;
    this.status = random.chance(this.p) ? true : false;
    this.isTransitioning = false;
    this.switchSpeed = random.range(0.5, 1);
    this.timespan = random.range(1, 4);
  }

  update(deltaTime) {
    this.totalDelta += deltaTime;
    if (this.isTransitioning && this.totalDelta > this.switchSpeed) {
      this.isTransitioning = false;
      this.totalDelta = 0;
    } else if (this.totalDelta > this.timespan) {
      this.totalDelta = 0;
      const newStatus = random.chance(this.p) ? true : false;
      this.switchSpeed = random.range(0.5, 1);
      this.timespan = random.range(1, 4);
      if (newStatus !== this.status) {
        this.isTransitioning = true;
      }
      this.status = newStatus;
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    const color = this.status ? 'white' : 'black';
    if (this.isTransitioning) {
      const prevColor = this.status ? 'black' : 'white';
      ctx.fillStyle = prevColor;
      ctx.fillRect(this.x, this.y, this.size, this.size);
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.size, this.size * (this.totalDelta / this.switchSpeed));
      return;
    }
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

}

const sketch = ({ width, height }) => {
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);
  const gliphData = getGliphImageData(text, fontStyle, cols, rows);

  /**
   * @type { Switch[] }
   */
  const switches = Array(cols * rows).fill(0).map((_, i) => {
    const x = (i % cols) * pixelSize;
    const y = Math.floor(i / cols) * pixelSize;
    const idx = i * 4;
    const r = gliphData.data[idx + 0];
    const g = gliphData.data[idx + 1];
    const b = gliphData.data[idx + 2];
    const p = (r + g + b) / 3 !== 0 ? 1 - baseP : baseP;
    return new Switch(x, y, pixelSize, p);
  })

  return ({ context, width, height, deltaTime }) => {
    switches.forEach(s => {
      s.update(deltaTime);
      s.draw(context);
    });
  };
};

canvasSketch(sketch, settings);
