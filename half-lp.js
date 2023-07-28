const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const seed = random.getRandomSeed();
random.setSeed(seed);
const numArcs = 16;
const minRadius = 120;
const maxRadius = 480;
const lineWidth = (maxRadius - minRadius) / numArcs;
const padding = 1;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `half-lp-${seed}`
};

const arcs = Array(numArcs).fill(0).map((e, i) => random.noise1D(i, 0.1, Math.PI * 0.25) + Math.PI * 1.75);

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = '#F2EECB';
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, height * 0.5);
    context.rotate(Math.PI * 0.5)
    context.lineWidth = lineWidth - padding;
    arcs.forEach((angle, i) => {
      const gradient = context.createConicGradient(0, 0, 0);
      gradient.addColorStop((angle - Math.PI * 0.0625) / (Math.PI * 2), '#000000FF');
      gradient.addColorStop(angle / (Math.PI * 2), '#00000000');
      context.beginPath();
      context.arc(0, 0, minRadius + (i + 0.5) * lineWidth, 0, angle);
      context.strokeStyle = gradient;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
