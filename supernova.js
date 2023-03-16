const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const eases = require('eases');

const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `supernova-${seed}`
};
const bg = 'black';
const fg = 'white';
const pieceCount = 256;

const sketch = ({ width, height }) => {
  const maxRadius = Math.min(width, height) * 0.45;
  const pieces = [];
  for (let i = 0; i < pieceCount; i++) {
    const angle = random.range(0, Math.PI * 2);
    const radius = eases.circOut(random.value()) * maxRadius;
    const size = math.mapRange(radius, 0, maxRadius, 6, 2);
    pieces.push({
      angle,
      radius,
      size
    });
  }

  return ({ context, width, height }) => {
    const cx = width * 0.5;
    const cy = height * 0.5;
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = fg;
    context.fillStyle = fg;

    pieces.forEach(p => {
      const x = Math.cos(p.angle) * p.radius;
      const y = Math.sin(p.angle) * p.radius;

      context.beginPath();
      context.moveTo(cx, cy);
      context.lineTo(cx + x, cy + y);
      context.stroke();

      context.beginPath();
      context.arc(cx + x, cy + y, p.size, 0, Math.PI * 2);
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
