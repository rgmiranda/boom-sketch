const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `bullet-glass-${seed}`
};

const numRips = 2048;

const sketch = ({ width, height }) => {
  let angle, radius, size, depth;
  const rips = [];
  random.setSeed(seed);
  for (let i = 0; i < numRips; i++) {
    angle = random.range(0, Math.PI * 2);
    size = random.range(Math.PI * 0.02, Math.PI * 0.025);
    radius = random.range(width * 0.05, width * 0.7);
    depth = random.range(width * 0.1, width * 0.2);
    rips.push({
      angle,
      size,
      radius,
      depth,
    });
  }
  rips.sort((a, b) => a.radius - b.radius);
  return ({ context }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, height * 0.5);

    context.strokeStyle = '#ff9966';
    rips.forEach(r => {
      context.lineWidth = math.mapRange(r.radius, width * 0.05, width * 0.7, 2, 0.1);
      context.beginPath();
      context.moveTo(Math.cos(r.angle) * (r.radius + r.depth), Math.sin(r.angle) * (r.radius + r.depth));
      context.lineTo(Math.cos(r.angle) * r.radius, Math.sin(r.angle) * r.radius);
      context.arc(0, 0, r.radius, r.angle, r.angle + r.size)
      context.lineTo(Math.cos(r.angle + r.size) * (r.radius + r.depth), Math.sin(r.angle + r.size) * (r.radius + r.depth));
      context.fill();
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
