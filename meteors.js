const canvasSketch = require('canvas-sketch');
const { Vector } = require('./calc');
const { random } = require('canvas-sketch-util');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'meteors'
};

/**
 * @type { Comet[] }
 */
let comets = [];

/**
 * @type { Particle[] }
 */
let particles = [];

class Comet {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pos = new Vector(random.range(width * 0.25, width), 0);
    this.vel = new Vector(random.range(-5, -2), random.range(15, 20));
    this.size = random.range(8, 15);
  }

  /**
   * @returns { boolean }
   */
  get active() {
    return this.pos.x >= 0
      && this.pos.x <= this.width
      && this.pos.y >= 0
      && this.pos.y <= this.height;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.x *= 0.99;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}

class Particle {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-3, 3), random.range(0, 2));
    this.timespan = random.rangeFloor(30, 120);
    this.age = 0;
    this.size = random.range(5, 8);
  }

  /**
   * @returns { boolean }
   */
  get active() {
    return this.age < this.timespan;
  }

  update() {
    if (!this.active) {
      return;
    }
    this.age++;
    this.pos.add(this.vel);
    this.vel.mult(0.98);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    ctx.beginPath();
    const size = this.size * eases.quartIn((this.timespan - this.age) / this.timespan);
    ctx.arc(this.pos.x, this.pos.y, size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}

/**
 * 
 * @param { HTMLCanvasElement } canvas 
 */
const addEventListeners = (canvas) => {
  canvas.onclick = (ev) => {
    comets.push(new Comet(canvas.width, canvas.height));
  };
};

const sketch = ({ canvas }) => {
  addEventListeners(canvas);
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    comets.forEach(c => {
      c.update();
      c.draw(context);
      particles.push(new Particle(c.pos.x, c.pos.y));
      particles.push(new Particle(c.pos.x, c.pos.y));
      particles.push(new Particle(c.pos.x, c.pos.y));
      particles.push(new Particle(c.pos.x, c.pos.y));
      particles.push(new Particle(c.pos.x, c.pos.y));
    });
    particles.forEach(p => {
      p.update();
      p.draw(context);
    })
    particles = particles.filter(p => p.active);
    comets = comets.filter(c => c.active);
  };
};

canvasSketch(sketch, settings);
