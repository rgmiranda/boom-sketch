const canvasSketch = require('canvas-sketch');
const { style } = require('canvas-sketch-util/color');
const { mapRange } = require('canvas-sketch-util/math');
const { noise2D, range, getRandomSeed, setSeed, rangeFloor } = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const { Vector } = require('../calc');

const noiseScale = 0.001;
const noiseAmp = Math.PI;
const particleCount = 4096;
const particleSpeedLimit = [2, 10];
const particleAgeLimit = [60, 240];
const seed = getRandomSeed();
setSeed(seed);

const colormap = 'magma';
const nshades = 64;
const colors = createColormap({
  colormap,
  nshades,
  alpha: 1,
  format: 'rgba',
});

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `flow-${seed}`
};

class Particle {
  constructor(width, height) {
    const x = rangeFloor(0, width);
    const y = rangeFloor(0, height);
    this.pos = new Vector(x, y);
    this.prevPos = {x, y};
    this.trail = [];
    this.width = width;
    this.height = height;
    this.active = true;
    this.speed = range(...particleSpeedLimit);
    this.maxAge = range(...particleAgeLimit);
    this.age = 0;
  }

  move(frame) {
    if (!this.active) {
      return;
    }

    const angle = noise2D(this.pos.x, this.pos.y, noiseScale, noiseAmp);
    const vel = new Vector(Math.cos(angle), Math.sin(angle));
    vel.mult(this.speed);
    this.prevPos = { x: this.pos.x, y: this.pos.y };
    this.pos.add(vel);
    this.age++;

    if (this.age >= this.maxAge) {
      this.active = false;
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    const color = colors[Math.floor(mapRange(this.age, 0, this.maxAge, 0, nshades - 1, true))];
    const alpha = mapRange(this.age, 0, this.maxAge, 1, 0, true);
    color[3] = alpha;
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y);
    ctx.lineTo(this.prevPos.x, this.prevPos.y);
    ctx.strokeStyle = style(color);
    ctx.stroke();
  }

}

let sketchManager;

const sketch = ({ width, height, context }) => {
  /** @type { Particle[] } */
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(width, height))
  }
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  context.lineWidth = 1;

  return ({ context, frame }) => {

    particles.forEach(p => {      
      p.move(frame);
      p.draw(context);
    });

    if (particles.filter(p => p.active).length === 0) {
      console.log('END');
      sketchManager.pause();
    }

  };
};

canvasSketch(sketch, settings).then(manager => sketchManager = manager);
