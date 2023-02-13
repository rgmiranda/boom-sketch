const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const cvWidth = cvHeight = 1080;
const radius = cvWidth * 0.4;
const colormap = 'copper';
const nshades = 12;
const colors = createColormap({
  colormap,
  nshades,
  format: 'hex',
  alpha: [1, 0]
});
let gradient;

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    const cx = width * 0.5;
    const cy = height * 0.5;
    gradient = context.createRadialGradient(cx - radius, cy, cx - radius, 0, cy, width * 0.96);
    for (let i = 0; i < nshades; i++) {
      gradient.addColorStop(i / nshades, colors[nshades - i - 1]);
    }

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();
    context.filter = 'blur(2px)';
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    context.restore();

  };
};

canvasSketch(sketch, settings);
