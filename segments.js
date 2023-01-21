const canvasSketch = require('canvas-sketch');
const { noise2D } = require('canvas-sketch-util/random');
const { mapRange } = require('canvas-sketch-util/math');
const colormap = require('colormap')
const bgColor = '#000';
const cvWidth = 1080;
const cvHeight = 1080;
const noiseFreq = 0.001;
const noiseAmp = 100;
const gridRows = 8;
const gridCols = 72;

const segmentColors = colormap({
  colormap: 'winter',
  nshades: noiseAmp,
  format: 'hex',
  alpha: 1
});

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};

class Point {

  constructor({x, y, noiseOffset}) {
    this.origX = x;
    this.origY = y;
    this.radius = 10;
    this.setNoiseOffset(noiseOffset);
  }
  
  setNoiseOffset(noiseOffset) {
    this.noiseOffset = noiseOffset;
    this.noise = noise2D(this.origX + this.noiseOffset, this.origY + this.noiseOffset, noiseFreq, noiseAmp)
    this.weight = mapRange(this.noise, -noiseAmp, noiseAmp, 0, 5);
    this.color = segmentColors[Math.floor(mapRange(this.noise, -noiseAmp, noiseAmp, 0, noiseAmp))];
  }

  get x() {
    return this.origX + this.noise;
  }

  get y() {
    return this.origY + this.noise;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();

    context.beginPath();
    context.translate(this.origX + this.noise, this.origY + this.noise);
    context.fillStyle = 'black';
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}

class QuadraticCurve {

  /**
   * 
   * @param  { Point[] } points
   */
  constructor({
    points,
    displayControlPoints = false,
    displayControlLines = false,
    displayMidpoints = false,
  }) {
    if (!Array.isArray(points)) {
      throw new TypeError('Array excepted');
    }
    if (points.length === 0) {
      throw new TypeError('Empty array received');
    }
    this.points = points;
    this.displayControlLines = displayControlLines;
    this.displayControlPoints = displayControlPoints;
    this.displayMidpoints = displayMidpoints;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context
   * @param { number } frame
   */
  draw(context, frame) {

    context.save();
    
    if (this.displayControlLines) {
      context.beginPath();
      context.lineTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        context.lineTo(this.points[i].x, this.points[i].y);
      }
      context.lineWidth = 1;
      context.strokeStyle = '#999';
      context.stroke();
    }

    let lastX, lastY;

    for (let i = 0; i < this.points.length - 1; i++) {
      const curr = this.points[i];
      const next = this.points[i + 1];
      
      const mx = (curr.x + next.x) * 0.9;
      const my = (curr.y + next.y);

      curr.setNoiseOffset(frame);
      
      context.beginPath();
      if (i === 0) {
        context.moveTo(curr.x, curr.y);
        lastX = curr.x ;
        lastY = curr.y ;
      } else if (i === this.points.length - 2) {
        next.setNoiseOffset(frame);
        context.moveTo(lastX, lastY);
        context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
        lastX = next.x;
        lastY = next.y;
      } else {
        context.moveTo(lastX, lastY);
        context.quadraticCurveTo(curr.x, curr.y, mx, my);
        lastY = my ;
        lastX = mx ;
      }
      context.strokeStyle = curr.color;
      context.lineWidth = curr.weight;
      context.stroke();

      if (this.displayMidpoints) {
        context.beginPath();
        context.arc(mx, my, 5, 0, 2 * Math.PI);
        context.fillStyle = 'blue';
        context.fill();
      }
    }

    context.restore();

    if (this.displayControlPoints) {
      for (const point of this.points) {
        point.draw(context);
      }
    }
  }
}

class Grid {
  constructor({ rows, cols, width, height }) {
    this.rows = rows;
    this.cols = cols;
    this.width = width;
    this.height = height;
    this.cw = width / cols;
    this.ch = height / rows;
    this.curves = [];

    for (let i = 0; i < rows; i++) {
      const points = [];
      for (let j = 0; j < cols; j++) {
        let x = j * this.cw + this.cw * 0.5;
        let y = i * this.ch + this.ch * 0.5;
        
        points.push(new Point({ x, y, noiseOffset: 0 }));
      }
      this.curves.push(new QuadraticCurve({
        points,
        displayControlPoints: false,
        displayControlLines: false,
        displayMidpoints: false,
      }));
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context, frame) {
    for (const curve of this.curves) {
      curve.draw(context, frame);
    }
  }
}

const sketch = ({ width, height }) => {

  const grid = new Grid({
    rows: gridRows, 
    cols: gridCols,
    width,
    height
  });

  return ({ context, width, height, frame }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
    grid.draw(context, frame * 5);
  };
};

canvasSketch(sketch, settings);
