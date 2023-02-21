const canvasSketch = require('canvas-sketch');
const { range, rangeFloor } = require('canvas-sketch-util/random');
const { Vector } = require('./calc');

const cvWidth = cvHeight = 1080;
const numSnakes = 64;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true
};

class Snake {
  constructor(canvasWidth, canvasHeight) {
    this.color = `hsl(${rangeFloor(0, 360)}, 100%, 50%)`;
    this.lifespan = rangeFloor(60, 120);
    this.lineWidth = 2;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.init();
    console.log(this.color);
  }
  
  init() {
    /** @type { Vector[] } */
    this.body = [];
    this.head = new Vector(range(0, this.canvasWidth), range(0, this.canvasHeight * 0.2));
    this.velocity = new Vector(0, range(4, 10));
    this.time = 0;
  }

  update() {
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
    this.velocity.x = range(-25, 25);
    this.velocity.y = range(-5, 20);
    this.head.add(this.velocity);
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
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    for (const snake of snakes) {
      snake.update();
      snake.draw(context);
    }
  };
};

canvasSketch(sketch, settings);
