const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const seed = random.getRandomSeed();
random.setSeed(seed);
const size = 1080;
const minRadius = 0;
const maxRadius = size * 0.48;
const numCircles = 512;
const noiseScale = 0.005;
const settings = {
  dimensions: [size, size],
  name: `circles-512-${seed}`
};

const sketch = () => {
  const circles = [];
  for (let i = 1; i < numCircles; i++) {
    const radius = math.mapRange(i, 0, numCircles - 1, maxRadius, minRadius);
    const angle = random.noise1D(i, noiseScale, Math.PI);
    circles.push({
      radius,
      angle
    });
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = 'white';
    context.lineWidth = 1;

    let pRadius = maxRadius;
    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.beginPath();
    context.arc(0, 0, maxRadius, 0, Math.PI * 2);
    context.stroke();
    for (const c of circles) {
      context.translate(Math.cos(c.angle) * (pRadius - c.radius), Math.sin(c.angle) * (pRadius - c.radius));
      context.beginPath();
      context.arc(0, 0, c.radius, 0, Math.PI * 2);
      context.stroke();
      pRadius = c.radius;
    }
    context.restore();
  };
};

canvasSketch(sketch, settings);
