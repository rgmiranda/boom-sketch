const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `sails-${Date.now()}`
};
const numSails = 12;

const colors = createColormap({
  colormap: 'bone',
  nshades: numSails
}).reverse();

const margin = 10;

const bg = 'black';

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    context.lineWidth = 4;
    let currentWidth = width - 2 * margin;

    context.rotate(-Math.PI * 0.5);
    context.translate(-width, 0);
    context.translate(margin, margin);
    for (let i = 0; i < numSails; i++) {
      context.fillStyle = colors[i];

      context.beginPath();
      context.moveTo(currentWidth, 0);
      context.arcTo(currentWidth, currentWidth, 0, currentWidth, currentWidth);
      context.lineTo(currentWidth, currentWidth);
      context.closePath();
      context.fill();
      currentWidth *= Math.SQRT1_2;
    }
  };
};

canvasSketch(sketch, settings);
