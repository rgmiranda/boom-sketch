const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `roulette-${seed}`
};

const numCircles = 16;
const minRadius = 50;
const maxRadius = 1080 * Math.SQRT1_2;
const radiusPadding = (maxRadius - minRadius) / numCircles;
const angleSplit = 2;

const sketch = () => {
  return ({ context, width, height, frame }) => {
    let angle, radius;
    context.fillStyle = '#eeeedd';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    context.lineWidth = radiusPadding * 1.01;
    random.setSeed(seed);
    for (let i = 0; i < numCircles; i++) {
      const rotateDir = (random.chance(0.5) ? random.range(-0.01, -0.001) : random.range(0.001, 0.01)) * frame;
      context.rotate(rotateDir);
      angle = Math.PI / (angleSplit * (numCircles - i));
      radius = (numCircles - i) * radiusPadding;
      for (let j = 0; j < 2 * angleSplit * (numCircles - i); j++) {
        context.rotate(angle);
        if (random.chance(0.35)) {
          continue;
        }
        context.beginPath();
        context.arc(0, 0, radius, 0, angle * 1.01);
        context.stroke();
      }
    }
  };
};

canvasSketch(sketch, settings);
