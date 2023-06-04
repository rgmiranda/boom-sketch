const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const seed = random.getRandomSeed();
random.setSeed(seed);
const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `droplets-${seed}`
};
const colors = risoColors.map(c => c.hex);

const origins = [
  {
    x: 0,
    y: 0,
    c: random.pick(colors),
  },
  {
    x: 1080,
    y: 0,
    c: random.pick(colors),
  },
  {
    x: 0,
    y: 1080,
    c: random.pick(colors),
  },
  {
    x: 1080,
    y: 1080,
    c: random.pick(colors),
  },
];
const wavesGenTime = 0.5;
const wavesSpeed = 3;
let lastTime = 0;
const maxRadius = 1080;
const waves = Array(origins.length).fill().map(e => [1]);

const sketch = () => {
  return ({ context, width, height, deltaTime }) => {
    context.fillStyle = '#F2EECB';
    context.fillRect(0, 0, width, height);
    context.save();
    context.globalCompositeOperation = 'multiply';
    origins.forEach((o, i) => {
      context.strokeStyle = o.c;
      waves[i].forEach((w, j) => {
        context.lineWidth = math.mapRange(w, 0, maxRadius, 40, 0.1, true);
        context.beginPath();
        context.arc(o.x, o.y, w, 0, Math.PI * 2);
        context.stroke();
        waves[i][j] += wavesSpeed;
      });
      waves[i] = waves[i].filter(w => w < maxRadius);
    });
    context.restore();

    if (lastTime >= wavesGenTime) {
      waves.forEach((w, i) => {
        waves[i].unshift(1);
      });
      lastTime = 0;
    }

    lastTime += deltaTime;
  };
};

canvasSketch(sketch, settings);
