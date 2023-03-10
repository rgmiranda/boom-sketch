const canvasSketch = require('canvas-sketch');
const { parse, style, offsetHSL } = require('canvas-sketch-util/color');
const { mapRange } = require('canvas-sketch-util/math');
const { noise2D, getRandomSeed, setSeed, rangeFloor, range, chance } = require('canvas-sketch-util/random');
const createColorMap = require('colormap');

const cvWidth = 1080;
const cvHeight = 1080;


const numSegments = 128;
const numLines = 12;
const noiseSeed = getRandomSeed();

const pointPadding = cvWidth / (numSegments + 1);

const nshades = 32;
const colormap = 'winter';
const colors = createColorMap({
  colormap,
  nshades,
  format: 'hex',
  alpha: 1
});

const settings = {
  dimensions: [cvWidth, cvHeight],
  name: noiseSeed
};

setSeed(noiseSeed);

class Point {

  constructor(x, y, width, color) {
    this.x = x;
    this.y = y;
    this.radius = 2;
    this.width = width;
    this.color = color;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();

    context.beginPath();
    context.translate(this.x, this.y);
    context.fillStyle = '#999';
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}

class Curve {
  /**
   * 
   * @param  { Point[] } points
   */
  constructor(...points) {
    if (!Array.isArray(points)) {
      throw new TypeError('Array excepted');
    }
    if (points.length === 0) {
      throw new TypeError('Empty array received');
    }
    this.points = points;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();

    let prev, curr, next;
    /** @type { Point[] } */
    const sparks = [];
    for (let i = 1; i < this.points.length - 1; i++) {
      prev = this.points[i - 1];
      curr = this.points[i + 0];
      next = this.points[i + 1];
      
      const mx = (curr.x + next.x) * 0.5;
      const my = (curr.y + next.y) * 0.5;
      
      context.beginPath();
      context.moveTo(prev.x, prev.y);
      if (i === this.points.length - 2) {
        context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
      } else {
        context.quadraticCurveTo(curr.x, curr.y, mx, my);
      }
      context.strokeStyle = curr.color;
      context.lineWidth = curr.width;
      context.shadowColor = curr.color;
      context.shadowBlur = curr.width * 2.5;
      context.stroke();

      if (chance(0.005)) {
        sparks.push(curr);
      }

      prev = curr;
    }
    context.restore();

    for (const spark of sparks) {
      const gradRadius = spark.width * 3;
      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, gradRadius);

      const startColor = offsetHSL(spark.color, 0, 0, 50).hex;
      const endColor = style([...parse(spark.color).rgb, 0]);
      gradient.addColorStop(0, startColor);
      gradient.addColorStop(1, endColor);

      context.save();

      context.translate(spark.x, spark.y);
      context.arc(0, 0, gradRadius, 0, Math.PI * 2);
      context.fillStyle = gradient;
      context.fill();

      context.restore();
    }
  }
}

/** @type { Curve[] } */
const curves = [];

const sketch = ({ height }) => {
  let points, x, y, yOffset, lineWidth, lineColor, noiseAmp, noiseFreq, noiseOffset;
  for (let i = 0; i < numLines; i ++) {
    y = rangeFloor(0, height);
    noiseAmp = mapRange(y, 0, height, 110, 200);
    noiseFreq = mapRange(y, 0, height, 0.001, 0.0001);
    noiseOffset = range(0, height);
    points = [];
    lineColor = colors[Math.floor(mapRange(y, 0, height, 0, nshades))];
    lineWidth = Math.floor(mapRange(y, 0, height, 2, 10));
    for (let j = -2; j < numSegments + 2; j++) {
      x = (j + 1) * pointPadding;
      yOffset = noise2D(x + noiseOffset, y, noiseFreq, noiseAmp);

      points.push(new Point(x, y + yOffset, lineWidth, lineColor));
    }
    curves.push(new Curve(...points));
  }
  return ({ context, width, height }) => {

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    for (const c of curves) {
      c.draw(context);
    }

  };
};

canvasSketch(sketch, settings);
