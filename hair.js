const canvasSketch = require('canvas-sketch');
const { noise3D, range, chance, pick } = require('canvas-sketch-util/random');
const { Vector } = require('./calc');

const noiseFreq = 0.001;
const noiseAmp = Math.PI;
const cvWidth = cvHeight = 1080;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};

class Point {
  /**
   * 
   * @param { { x: number, y: number } } param0 
   */
  constructor({x, y}) {
    this.pos = new Vector(x, y);
    this.displayPos = this.pos.copy();
    this.angle = noise3D(x, y, 0, noiseFreq, noiseAmp);
    this.velocity = Vector.fromAngle(this.angle);
    this.once = false;
  }
  
  update(frame = 0) {
    this.pos.add(this.velocity);
    this.displayPos.add(this.velocity);
    this.angle = noise3D(this.displayPos.x, this.displayPos.y, frame * 2, noiseFreq, noiseAmp);
    this.velocity = Vector.fromAngle(this.angle);

    if (this.once) {
      return;
    }

    this.once = true;

    if (this.displayPos.x > cvWidth) {
      this.displayPos.x = 0;
    } else if (this.displayPos.x < 0) {
      this.displayPos.x = cvWidth;
    }

    if (this.displayPos.y > cvHeight) {
      this.displayPos.y = 0;
    } else if (this.displayPos.y < 0) {
      this.displayPos.y = cvHeight;
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();

    context.translate(this.displayPos.x, this.displayPos.y);
    context.beginPath();
    context.arc(0, 0, 1, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();

    context.restore();
  }
}

/** @type { Point[] } */
const points = [];

const sketch = ({ width, height, context }) => {
  for (let i = 0; i < 512; i++) {
    if (chance(0.5)) {
      points.push(new Point({x: 0, y: range(0, height)}));
    } else {
      points.push(new Point({x: range(0, width), y: 0}));
    }
  }
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  return ({ context, width, height, frame }) => {

    for (const point of points) {
      point.update(frame);
      point.draw(context);
    }
  };
};

canvasSketch(sketch, settings);
