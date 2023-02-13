const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { rangeFloor, range, getRandomSeed, setSeed } = require('canvas-sketch-util/random');
const createColormap = require('colormap');

const cvWidth = 1080, cvHeight = 1080;
const bg = '#000';
const fg = 'orange';
const numSlices = 32;
const angle = 2 * Math.PI / numSlices;
const colormap = 'YIOrRd';
const nshades = numSlices;
const randomSeed = getRandomSeed();

const arcsColors = createColormap({
  colormap,
  nshades,
  format: 'hex',
  alpha: 1
})

const settings = {
  dimensions: [cvWidth, cvHeight],
  name: randomSeed,
  animate: true,
};

class Arc {
  constructor (x, y, radius, width, color, angle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.width = width;
    this.color = color;
    this.angle = angle;
    this.fromAngle = range(-Math.PI, 0);
    this.toAngle = range(0, Math.PI);
    this.angularVelocity = range(-0.05, 0.05);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.beginPath();
    context.arc(0, 0, this.radius, this.fromAngle, this.toAngle);
    context.lineWidth = this.width;
    context.strokeStyle = this.color;
    context.stroke();
    context.restore();
  }

  update() {
    this.angle += this.angularVelocity;
  }
}

class ClockHand {
  constructor(x, y, radius, width, height, color, angle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.width = width;
    this.color = color;
    this.angle = angle;
    this.height = height;
    this.angularVelocity = range(-0.05, 0.05);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.beginPath();
    context.rect(-this.width * 0.5, this.radius - this.height * 0.5, this.width, this.height);
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }

  update() {
    this.angle += this.angularVelocity;
  }
}

/** @type { Arc[] } */
const arcs = [];

/** @type { ClockHand[] } */
const clockHans = [];

const sketch = ({ width, height }) => {
  setSeed(randomSeed);
  let radius, lineWidth, rectHeight, rectWidth, rectRadius, arcColor;

  const cx = width * 0.5;
  const cy = height * 0.5;

  for (let i = 0; i < numSlices; i++) {
    radius = rangeFloor(width * 0.1, width * 0.5);
    lineWidth = rangeFloor(2, 10);
    arcColor = arcsColors[Math.floor(mapRange(radius, width * 0.1, width * 0.5, 0, nshades))];

    arcs.push(new Arc(cx, cy, radius, lineWidth, arcColor, i * angle));

    rectHeight = rangeFloor(width * 0.2, width * 0.3);
    rectRadius = rangeFloor(width * 0.3, width * 0.4);
    rectWidth = rangeFloor(2, 10);

    clockHans.push(new ClockHand(cx, cy, rectRadius, rectWidth, rectHeight, fg, i * angle));
  }

  return ({ context, width, height }) => {
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < numSlices; i++) {
      arcs[i].draw(context);
      arcs[i].update();
      clockHans[i].draw(context);
      clockHans[i].update();
    } 
  };
};

canvasSketch(sketch, settings);
