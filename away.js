const canvasSketch = require('canvas-sketch');
const { contrastRatio } = require('canvas-sketch-util/color');
const createColormap = require('colormap');

const cvWidth = cvHeight = 1080;
const radius = cvWidth * 0.25;
const colormap = 'plasma';
const nshades = 12;
const colors = createColormap({
  colormap,
  nshades,
  format: 'rgbaString',
  alpha: [0, 1]
});
let gradient;

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    const cx = width * 0.5;
    const cy = height * 0.5;
    gradient = context.createRadialGradient(0 , 0, 0, 0, 0, radius);
    for (let i = 0; i < nshades; i++) {
      gradient.addColorStop(i / nshades, colors[nshades - i - 1]);
    }

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();
    context.filter = 'blur(2px)';
    context.translate(cx, cy);
    context.rotate(Math.PI * 0.75);
    context.transform(1, 1.5, 0, 1, 0, 0);
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    context.restore();

  };
};

canvasSketch(sketch, settings);
