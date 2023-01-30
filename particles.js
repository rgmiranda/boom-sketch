const canvasSketch = require('canvas-sketch');
const { rangeFloor } = require('canvas-sketch-util/random');
const  { Vector } = require('./vector');

const cvWidth = 1080;
const cvHeight = 1080;

const k = 0.5;
const c = 0.8;
const repelRadius = 40000;

let mouseX, mouseY;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};

class Particle {
  constructor({x, y, radius}) {
    /** @type { Vector } */
    this.pos = new Vector(x, y);
    /** @type { Vector } */
    this.origin = this.pos.copy();
    /** @type { Vector } */
    this.acc = new Vector(0, 0);
    /** @type { Vector } */
    this.vel = new Vector(0, 0);
    /** @type { number } */
    this.radius = radius;
  }

  /**
   * 
   * @param { Vector } force 
   */
  applyForce(force) {
    this.acc.add(force);
  }

  attract() {
    const force = this.origin.copy();
    force.sub(this.pos);
    if (force.mag === 0) {
      return;
    }
    force.mult(k / force.mag);
    this.applyForce(force);
  }

  repel(x, y) {
    const dx = this.pos.x - x;
    const dy = this.pos.y - y;
    if (dx * dx + dy * dy > repelRadius) {
      return;
    }
    const force = new Vector(dx, dy);
    force.mult(c / force.mag);
    this.applyForce(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.mult(0.97);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = '#AAA';
    context.strokeStyle = '#FFF';
    context.stroke();
    context.fill();
  }
}

/**
 * 
 * @param { CanvasRenderingContext2D } context
 */
function visualize(context) {
  for (const p of particles) {
    if (mouseX !== undefined && mouseY !== undefined) {
      context.beginPath();
      context.arc(mouseX, mouseY, Math.sqrt(repelRadius), 0, Math.PI * 2);
      context.strokeStyle = '#666';
      context.stroke();
      p.repel(mouseX, mouseY);
    }
    p.attract();
    p.update();
    p.draw(context);
  }
}

/**
 * 
 * @param { HTMLCanvasElement } canvas
 */
function addListeners(canvas) {
  canvas.addEventListener('mousemove', (ev) => {
    mouseX = (ev.offsetX / canvas.offsetWidth) * canvas.width;
    mouseY = (ev.offsetY / canvas.offsetHeight) * canvas.height;
  });
}

/** @type { Particle[] } */
const particles = [];

const sketch = ({canvas, width, height }) => {
  for (let i = 0; i < 200; i++) {
    particles.push(new Particle({
      x: rangeFloor(0, width),
      y: rangeFloor(0, height),
      radius: rangeFloor(5, 20)
    }));
  }

  addListeners(canvas);
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    visualize(context);
  };
};

canvasSketch(sketch, settings);
