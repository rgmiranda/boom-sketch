const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const { Vector } = require('./calc');

const cvWidth = cvHeight = 1200
const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};
const colormap = 'plasma';
const nshades = 1024;
const colors = createColormap({
  colormap,
  nshades,
  format: 'hex',
  alpha: 1,
});

class Point {

  constructor(x, y, width, height) {
    this.pos = new Vector(x, y);
    this.velocity = Vector.fromAngle(Math.random() * Math.PI * 2);
    this.velocity.mult(Math.random() * 5 + 5);
    this.width = width;
    this.height = height;
  }

  update() {
    this.pos.add(this.velocity);
    if (this.pos.x > this.width) {
      this.velocity.x *= -1;
      this.pos.x = this.width;
    } else if (this.pos.x < 0) {
      this.velocity.x *= -1;
      this.pos.x = 0;
    }
    if (this.pos.y > this.height) {
      this.velocity.y *= -1;
      this.pos.y = this.height;
    } else if (this.pos.y < 0) {
      this.velocity.y *= -1;
      this.pos.y = 0;
    }
  }
}

class Segment {
  /**
   * 
   * @param { Point } from 
   * @param { Point } to 
   */
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.colorIdx = 0;
  }

  update() {
    this.from.update();
    this.to.update();
    this.colorIdx = (this.colorIdx + 1) % nshades;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();

    context.beginPath();
    context.moveTo(this.from.pos.x, this.from.pos.y);
    context.lineTo(this.to.pos.x, this.to.pos.y);
    context.strokeStyle = colors[this.colorIdx];
    context.stroke();

    context.restore();
  }
}

/**
 * @type { Segment[] }
 */
const segments = [];

const sketch = ({width, height, context}) => {
  const from = new Point(0, 0, width, height);
  const to = new Point(width, height, width, height);
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  segments.push(new Segment(from, to));
  return ({ context, width, height }) => {
    for (const s of segments) {
      s.update();
      s.draw(context);
    }
  };
};

canvasSketch(sketch, settings);
