const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

const cvWidth = cvHeight = 1080;
const numParticles = 32;
const preload = p5 => {
  // You can use p5.loadImage() here, etc...
};

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  // Turn on a render loop
  animate: true,
  dimensions: [cvWidth, cvHeight]
};

class Particle {
  constructor(x, y, p5) {
    this.pos = p5.createVector(x, y);
    this.vel = p5.createVector(0, 0);
    this.acc = p5.createVector(0, 0);
    this.p5 = p5;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  attract(x, y) {
    const force = this.p5.createVector(x, y);
    force.sub(this.pos);
    const speed = this.p5.constrain(1 / force.mag(), 0.2, 10);
    force.normalize();
    force.mult(speed);
    this.applyForce(force);

  }

  update() {
    this.vel.add(this.acc);
    this.vel.mult(0.99);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  draw() {
    const r = this.p5.map(this.vel.mag(), 0, 50, 5, 50, true);
    this.p5.circle(this.pos.x, this.pos.y, r);
  }
}

const particles = [];

canvasSketch(( { width, height, p5 } ) => {
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(Math.floor(Math.random() * width), Math.floor(Math.random() * height), p5));
  }
  return ({ p5, width, height }) => {
    p5.background(0);
    p5.fill(255);
    p5.stroke(255);

    particles.forEach(p => {
      p.attract(p5.mouseX, p5.mouseY);
      p.update();
      p.draw();
    });

  };
}, settings);
