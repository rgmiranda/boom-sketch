const canvasSketch = require('canvas-sketch');
const { noise2D } = require('canvas-sketch-util/random');
const cvWidth = 1080;
const cvHeight = 1080;
const noiseFreq = 0.5;
const noiseAmp = 90;
const gridRows = 6;
const gridCols = 10;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
};

class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();

    context.beginPath();
    context.translate(this.x, this.y);
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
  constructor({ points, displayControlPoints = false, displayControlLines = false }) {
    if (!Array.isArray(points)) {
      throw new TypeError('Array excepted');
    }
    if (points.length === 0) {
      throw new TypeError('Empty array received');
    }
    this.points = points;
    this.displayControlLines = displayControlLines;
    this.displayControlPoints = displayControlPoints;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {

    
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

    context.beginPath();
    for (let i = 0; i < this.points.length - 1; i++) {
      const curr = this.points[i];
      const next = this.points[i + 1];
      
      const mx = (curr.x + next.x) * 0.5;
      const my = (curr.y + next.y) * 0.5;

      if (i === 0) {
        context.moveTo(curr.x, curr.y);
      } else if (i === this.points.length - 2) {
        context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
      } else {
        context.quadraticCurveTo(curr.x, curr.y, mx, my);
      }
            
    }
    context.strokeStyle = 'blue';
    context.lineWidth = 4;
    context.stroke();

    context.restore();

    if (this.displayControlPoints) {
      for (const point of this.points) {
        point.draw(context);
      }
    }
  }

  /**
   * 
   * @param { MouseEvent } ev
   * @param { HTMLCanvasElement } canvas
   */
  onMouseDown(ev, canvas) {
    const x = (ev.offsetX / canvas.offsetWidth) * canvas.width;
    const y = (ev.offsetY / canvas.offsetHeight) * canvas.height;
    let dist;
    let isDragging = false;

    for (const point of this.points) {
      dist = Math.sqrt((point.x - x) * (point.x - x) + (point.y - y) * (point.y - y))
      point.isDragging = (dist < point.radius);
      isDragging |= point.isDragging;
    }
    if (!isDragging) {
      this.points.push(new Point(x, y));
    }
  }

  /**
   * 
   * @param { MouseEvent } ev
   * @param { HTMLCanvasElement } canvas
   */
  onMouseMove(ev, canvas) {
    const x = (ev.offsetX / canvas.offsetWidth) * canvas.width;
    const y = (ev.offsetY / canvas.offsetHeight) * canvas.height;
    for (const point of this.points) {
      if (!point.isDragging) {
        continue;
      }
      point.x = x;
      point.y = y;
    }
  }

  onMouseUp() {
    for (const point of this.points) {
      point.isDragging = false;
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
        const x = j * this.cw + this.cw * 0.5 + noise2D(i, j, noiseFreq, noiseAmp);
        const y = i * this.ch + this.ch * 0.5 + noise2D(i, j, noiseFreq, noiseAmp);
        points.push(new Point(x, y));
      }
      this.curves.push(new QuadraticCurve({ points }));
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    for (const curve of this.curves) {
      curve.draw(context);
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

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    grid.draw(context);
  };
};

canvasSketch(sketch, settings);
