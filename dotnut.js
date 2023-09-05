const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'donnut',
};

const points = 4096 * 32;
const radius = 200;
const amplitude = 300;

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = '#eeeedd';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    let x, y, r, a;
    context.translate(width * 0.5, height * 0.5);
    for (let i = 0; i < points; i++) {
      a = random.range(0, Math.PI * 2);
      r = amplitude * eases.circInOut(random.range(0, 1)) + radius;
      x = Math.cos(a) * r;
      y = Math.sin(a) * r;
      context.beginPath();
      context.arc(x, y, random.range(0.5, 1.25), 0, Math.PI * 2);
      context.fill();
    }
  };
};

canvasSketch(sketch, settings);
