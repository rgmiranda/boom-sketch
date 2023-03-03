const canvasSketch = require('canvas-sketch');
const { pick, getRandomSeed, setSeed } = require('canvas-sketch-util/random');
const p5 = require('p5');
const risoColors = require('riso-colors');

const cvWidth = cvHeight = 1080;
const numParticles = 512;
const noiseScale = 0.01;
const seed = 165007; // getRandomSeed();
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
    this.speed = p5.random() * 2 + 2;
    this.p5 = p5;
    this.prev;
    this.color = color;
  }

  flow(frame) {
    const angle = this.p5.noise(this.pos.x * noiseScale, this.pos.y * noiseScale, frame * noiseScale) * Math.PI * 2;
    const vel = [Math.cos(angle) * this.speed, Math.sin(angle) * this.speed];
    this.prev = { x: this.pos.x, y: this.pos.y };
    this.pos.add(vel);
  }

  draw() {
    this.p5.stroke(this.color);
    if (this.prev) {
      this.p5.line(this.pos.x, this.pos.y, this.prev.x, this.prev.y)
    }
  }
}

const particles = [];

canvasSketch(({ width, height, p5 }) => {
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(width, Math.floor(Math.random() * height), p5, pick(colors)));
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

  };
}, settings);
