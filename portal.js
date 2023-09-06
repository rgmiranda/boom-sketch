const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'portals',
};

const numPortals = 24;
const colors =  createColormap({
  colormap: 'bone',
  nshades: numPortals,
});

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    let angle;
    let radius = width * Math.SQRT1_2;
    let radiusStep = 3 * radius / numPortals;
    let x, y;
    context.translate(width * 0.5, height * 0.5);
    for (let i = 0; i < numPortals; i++) {
      context.save();
      angle = Math.PI / (64 * (numPortals - i));
      if (i % 2 === 0) {
        context.rotate(18 * Math.PI / 128);
      } else {
        context.rotate(-18 * Math.PI / 128);
      }
      context.fillStyle = colors[i];
      context.strokeStyle = colors[i];
      const freq = math.mapRange(i, 0, numPortals - 1, 0.0005, 0.017);
      const blur = Math.floor(math.mapRange(i, 0, numPortals * 0.65, 10, 0, true));
      if (blur !== 0) {
        context.filter = `blur(${blur}px)`;
      }
      context.lineWidth = 5;
      context.beginPath();
      for (let j = 0; j < 128 * (numPortals - i); j++) {
        //const offset = Math.sin(18 * angle * j) * ratio * radiusStep;
        x = Math.cos(angle * (j + 1));
        y = Math.sin(angle * (j + 1));
        const offset = random.noise2D(x * radius, y * radius, freq, radiusStep * 0.5);

        context.arc(0, 0, radius + offset, angle * j, angle * (j + 1));
      }
      context.fill();
      radius -= radiusStep;
      radiusStep *= 0.875;
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
