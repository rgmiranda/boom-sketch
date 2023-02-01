const canvasSketch = require('canvas-sketch');
const { rangeFloor } = require('canvas-sketch-util/random');
const { Vector } = require('./vector');
const colormap = require('colormap');
const { quadIn } = require('eases');

const cvWidth = 1080;
const cvHeight = 1080;

const k = 0.5;
const c = 0.8;
const repelRadius = 40000;
const circleCount = 15;
const dotRadius = 10;
const dotPadding = 4;
const velocityDamp = 0.98;
const colors = colormap({
  colormap: 'winter',
  nshades: circleCount,
  format: 'hex',
  alpha: 1
});

let mouseX, mouseY;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};

class Particle {
  constructor({x, y, radius, color}) {
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
    /** @type { string } */
    this.color = color;
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
    this.vel.mult(velocityDamp);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    console.log(this)
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.stroke();
    context.fill();
  }
}

/**
 * 
 * @param { CanvasRenderingContext2D } context
 */
function visualize(context) {
  if (mouseX !== undefined && mouseY !== undefined) {
    context.beginPath();
    context.arc(mouseX, mouseY, Math.sqrt(repelRadius), 0, Math.PI * 2);
    context.strokeStyle = '#666';
    context.stroke();
  }
  for (const p of particles) {
    if (mouseX !== undefined && mouseY !== undefined) {
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
  let particleCount, phi, angleSize;
  const mx = width * 0.5;
  const my = height * 0.5;
  const initAngleOffset = Math.PI / ( 2 * circleCount );
  for (let i = 0; i < circleCount; i++) {
    if (i === 0) {
      particles.push(new Particle({
        x: mx,
        y: my,
        radius: (1- quadIn(i / circleCount)) * dotRadius,
        color: colors[i]
      }));
    } else {
      particleCount = Math.floor((i + 1) * Math.PI);
      angleSize = 2 * Math.PI / particleCount;
      phi = initAngleOffset * i;
      for (let j = 0; j < particleCount; j++) {
        particles.push(new Particle({
          x: mx + Math.cos(phi) * 2 * i * (dotRadius + dotPadding),
          y: my + Math.sin(phi) * 2 * i * (dotRadius + dotPadding),
          radius: (1 - quadIn(i / circleCount)) * dotRadius,
          color: colors[i]
        }));
        phi += angleSize;
      }
    }
  }

  addListeners(canvas);
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    visualize(context);
  };
};

canvasSketch(sketch, settings);
