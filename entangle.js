const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `entangle-${seed}`
};

random.setSeed(seed);

const colors = [
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
];
const numStrokes = 1024;

const sketch = () => {
  return ({ context, width, height }) => {
    const radius = width * 0.48;
    let from, to, mid;
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);

    for (let i = 0; i < numStrokes; i++) {
      from = random.range(0, Math.PI * 2);
      to = from + random.range(0, Math.PI);
      mid = (from + to) * 0.5;
      context.strokeStyle = random.pick(colors);
      context.beginPath();
      context.moveTo(Math.cos(from) * radius, Math.sin(from) * radius);
      context.quadraticCurveTo(Math.cos(mid) * radius * 0.4, Math.sin(mid) * radius * 0.4, Math.cos(to) * radius, Math.sin(to) * radius)
      context.stroke();

    }
  };
};

canvasSketch(sketch, settings);
