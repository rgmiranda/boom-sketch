const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const eases = require('eases');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `void-${seed}`
};

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    const colors = Array(8).fill(0).map(() => random.pick(risoColors).hex );
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    context.strokeStyle = 'white';

    const minRadius = 1;
    const maxRadius = width * Math.SQRT1_2;

    let r = minRadius;
    let lw;
    do {
      if (r < maxRadius * 0.5) {
        lw = 4 * eases.sineIn(r / (maxRadius * 0.5));
      } else {
        lw = 4 * eases.sineIn(1 - (r - maxRadius * 0.5) / (maxRadius * 0.5));
      }
      context.lineWidth = lw;
      context.beginPath();
      context.strokeStyle = random.pick(colors);
      context.arc(0, 0, r, 0, Math.PI * 2);
      context.stroke();
      r += random.range(4, 15);
    } while (r <= maxRadius);

  };
};

canvasSketch(sketch, settings);
