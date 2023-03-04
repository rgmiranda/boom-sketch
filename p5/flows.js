const canvasSketch = require('canvas-sketch');
const { pick, getRandomSeed, setSeed, range, rangeFloor } = require('canvas-sketch-util/random');
const p5 = require('p5');
const risoColors = require('riso-colors');

const cvWidth = cvHeight = 1080;
const numParticles = 1024;
const noiseScale = 0.002;
const seed = getRandomSeed();
const particleAge = {
  min: 60,
  max: 300
};
const preload = p5 => {
  // You can use p5.loadImage() here, etc...
};
setSeed(seed);

const colors = [
  pick(risoColors).hex,
  pick(risoColors).hex,
  pick(risoColors).hex,
  pick(risoColors).hex,
];

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  // Turn on a render loop
  animate: true,
  dimensions: [cvWidth, cvHeight],
  name: seed,
};

class Particle {
  constructor(x, y, p5, color) {
    this.pos = p5.createVector(x, y);
    this.speed = range(2, 5);
    this.p5 = p5;
    this.prev;
    this.color = p5.color(color);
    this.age = 0;
    this.maxAge = rangeFloor(particleAge.min, particleAge.max);
    this.active = true;
  }

  flow(frame) {
    if (!this.active) {
      return;
    }
    const angle = this.p5.noise(this.pos.x * noiseScale, this.pos.y * noiseScale) * Math.PI * 2;
    const vel = [Math.cos(angle) * this.speed, Math.sin(angle) * this.speed];
    this.prev = { x: this.pos.x, y: this.pos.y };
    this.pos.add(vel);
    this.age++;
    this.active = this.age <= this.maxAge;
  }

  draw() {
    const alpha = Math.ceil(this.p5.map(this.age, 0, this.maxAge, 255, 0, true));
    this.color.setAlpha(alpha);
    this.p5.stroke(this.color);
    if (this.prev) {
      this.p5.line(this.pos.x, this.pos.y, this.prev.x, this.prev.y)
    }
  }
}

let particles = [];
let sketchManager;

canvasSketch(({ width, height, p5 }) => {
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(rangeFloor(0, width), rangeFloor(0, height), p5, pick(colors)));
  }
  p5.background(0);
  p5.strokeWeight(2);
  return ({ p5, frame }) => {
    p5.fill(255);
    p5.stroke(255);

    particles.forEach(p => {
      p.flow(frame);
      p.draw();
    });
    particles = particles.filter(p => p.active);
    if (particles.length === 0) {
      sketchManager.pause();
    }
  };
}, settings).then(manager => sketchManager = manager);
