const canvasSketch = require('canvas-sketch');
const { style } = require('canvas-sketch-util/color');
const { mapRange } = require('canvas-sketch-util/math');
const { getRandomSeed, setSeed, rangeFloor, chance, pick, range } = require('canvas-sketch-util/random');
const { Vector } = require('../calc');
const { FlowField } = require('./flowfield');

const cvWidth = cvHeight = 1080;
const noiseScale = 0.001;
const noiseAmp = Math.PI;
const shipCount = 64;
const rows = cols = 32;
const seed = getRandomSeed();
setSeed(seed);

const settings = {
  dimensions: [cvWidth, cvHeight],
  animate: true,
  name: `ships-${seed}`
};


class Ship {

  /**
   * @param { FlowField } flowfield 
   */
  constructor(flowfield) {
    this.width = flowfield.width;
    this.height = flowfield.height;
    this.flowfield = flowfield;
    this.speed = range(4, 6);
    this.spawn();
  }

  spawn() {
    let x;
    let y;
    if (chance(0.5)) {
      x = 0;
      y = rangeFloor(this.height * 0.6, this.height);
    } else {
      x = rangeFloor(0, this.width * 0.4);
      y = this.height;
    }
    this.pos = new Vector(x, y);
  }

  checkBoundaries() {
    return (
      this.pos.x <= this.width
      && this.pos.x >= 0
      && this.pos.y <= this.height
      && this.pos.y >= 0);
  }

  move() {
    this.flow = this.flowfield.getFlow(this.pos.x, this.pos.y).copy();
    this.flow.mult(this.speed);
    this.pos.add(this.flow);

    if (!this.checkBoundaries()) {
      this.spawn();
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    if (this.flow) {
      ctx.rotate(this.flow.angle);
    }
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(8, 10);
    ctx.lineTo(-8, 10);
    ctx.closePath();
    ctx.fillStyle = 'white'
    ctx.fill();
    ctx.restore();
  }

}

let sketchManager;

const sketch = ({ width, height }) => {
  
  const field = new FlowField(width, height, rows, cols, noiseScale, noiseAmp);
  const ships = [];
  for (let i = 0; i < shipCount; i++) {
    ships.push(new Ship(field));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    ships.forEach(ship => {
      ship.move();
      ship.draw(context);
    });
    //field.draw(context);
  };
};

canvasSketch(sketch, settings).then(manager => sketchManager = manager);
