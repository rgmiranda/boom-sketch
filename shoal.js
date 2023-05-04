const canvasSketch = require('canvas-sketch');
const { range, rangeFloor, noise3D } = require('canvas-sketch-util/random');
const { Vector } = require('./calc');

const cvWidth = cvHeight = 1080;
const numSnakes = 1024;
const noiseFreq = 0.0002;
const ts = Date.now();

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
  name: `shoal-${ts}`
};

class Snake {
  constructor(canvasWidth, canvasHeight) {
    this.color = 'white';
    this.lifespan = rangeFloor(60, 120);
    this.maxLength = 10;
    this.lineWidth = 2;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.init();
  }
  
  init() {
    this.body = [];
    this.head = new Vector(range(0, this.canvasWidth), range(0, this.canvasHeight));
    this.velocity = new Vector(0, 0);
    this.force = range(2, 10);
    this.time = 0;
  }

  update(frame) {
    if (this.time > this.lifespan) {
      if (this.body.length > 0) {
        this.body.pop();
      } else {
        this.init();
      }
      return;
    }
    this.time++;
    this.body.unshift(this.head.copy());
    this.velocity = Vector.fromAngle(noise3D(this.head.x, this.head.y, frame * 40, noiseFreq, Math.PI) + Math.PI)
    this.velocity.mult(this.force);
    this.head.add(this.velocity);
    if (this.body.length >= this.maxLength) {
      this.body.pop();
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();

    context.beginPath();
    context.moveTo(this.head.x, this.head.y);
    for (const v of this.body) {
      context.lineTo(v.x, v.y);
    }
    context.strokeStyle = this.color;
    context.lineWidth = this.lineWidth;
    context.stroke();

    context.restore();
  }

}

/**
 * @type { Snake[] }
 */
const snakes = [];

const sketch = ({ width, height}) => {
  for (let i = 0; i < numSnakes; i++) {
    snakes.push(new Snake(width, height));
  }
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    for (const snake of snakes) {
      snake.update(frame);
      snake.draw(context);
    }
  };
};

canvasSketch(sketch, settings);
