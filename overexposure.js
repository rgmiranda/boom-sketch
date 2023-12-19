const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const numStrokes = 1024;

const colors = createColormap({
  colormap: 'bone',
  nshades: 32
})

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, height * 0.5);

    for (let i = 0; i < numStrokes; i++) {
      const radius = random.range(10, width * Math.SQRT1_2)
      context.save();
      context.strokeStyle = random.pick(colors);
      context.lineWidth = radius < 200 ? 1: 4;
      context.rotate(random.range(0, Math.PI * 2));
      context.beginPath();
      context.arc(0, 0, radius, 0, random.range(Math.PI * 0.0625, Math.PI * 0.25));
      context.stroke();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
