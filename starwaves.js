const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { noise2D, getRandomSeed, setSeed } = require('canvas-sketch-util/random');
const createColorMap = require('colormap');

const cvWidth = 1080;
const cvHeight = 1080;


const numRows = 128;
const numLines = 128;
const noiseAmp = 250;
const noiseFreq = 0.001;
const noiseSeed = getRandomSeed();


const linePadding = cvWidth / (numLines + 1);
const pointPadding = cvHeight / (numRows + 1);

const nshades = 32;
const colormap = 'bone'
const colors = createColorMap({
  colormap,
  nshades,
  format: 'hex',
  alpha: 1
});
const displayControlPoints = false;

const settings = {
  dimensions: [cvWidth, cvHeight],
  name: noiseSeed
};

setSeed(noiseSeed);

class Point {

  constructor(x, y, color, width) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.radius = 2;
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

    if (displayControlPoints) {
      context.beginPath();
      context.lineTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        context.lineTo(this.points[i].x, this.points[i].y);
      }
      context.lineWidth = 1;
      context.strokeStyle = '#999';
      context.stroke();
    }

    let prev, curr, next;
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
      context.lineWidth = 4;
      context.stroke();
      prev = curr;
    }

    context.restore();

    if (displayControlPoints) {
      for (const point of this.points) {
        point.draw(context);
      }
    }
  }
}

const curves = [];

const sketch = () => {
  let points, x, y, nx, lineWidth, lineColor;
  for (let i = 0; i < numLines; i ++) {
    x = (i + 1) * linePadding;
    points = [];
    for (let j = 0; j < numRows; j++) {
      y = (j + 1) * pointPadding;
      nx = noise2D(x, y, noiseFreq, noiseAmp);
      nx *= 1;//mapRange(Math.abs(x - y), 0, cvWidth, 1, 0.001);
      lineColor = colors[Math.floor(mapRange(nx, -noiseAmp, noiseAmp, 0, nshades))];
      lineWidth = Math.floor(mapRange(nx, -noiseAmp, noiseAmp, 1, 5));
      points.push(new Point(x + nx, y, lineColor, lineWidth));
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
