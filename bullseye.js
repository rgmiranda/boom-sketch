const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const eases = require('eases');

const seed = random.getRandomSeed();
random.setSeed(seed);

const size = 1080
const settings = {
  dimensions: [size, size],
  name: `bullseye-${seed}`
};
const bg = 'black';
const fg = 'white';
const lines = 32;
const circles = 4;

const sketch = ({ width, height }) => {
  const maxRadius = Math.min(width, height) * 0.48;
  const circlePadding = maxRadius / circles;
  console.log(circlePadding);

  return ({ context, width, height }) => {
    let x, y, radius, angle;
    const cx = width * 0.5;
    const cy = height * 0.5;

    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    context.translate(cx, cy);

    context.strokeStyle = fg;

    let pRadius = 0;

    for (let i = 0; i < circles; i++) {

      for (let j = 0; j < lines * (i + 1) * (i + 1); j++) {
        angle = random.gaussian(0, 0.35) * Math.PI;
  
        context.save();
        context.rotate(angle + Math.PI * (i + 0.5));
  
        context.beginPath();
        context.moveTo(0, pRadius);
        context.lineTo(0, (i + 1) * circlePadding);
        context.stroke();
        context.restore();
      }
      pRadius = (i + 1) * circlePadding;
    }

  };
};

canvasSketch(sketch, settings);
