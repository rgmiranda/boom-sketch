const canvasSketch = require('canvas-sketch');
const { quadOut, quadIn } = require('eases');
const colormap = require('colormap');

const cvWidth = 1080;
const cvHeight = 1080;
const circles = 38;
const circleWidth = 4;
const circlePadding = 6;
const minNshades = 9;
const colors = colormap({
  colormap: 'bone',
  nshades: circles >= minNshades ? circles : minNshades,
  format: 'hex',
  alpha: 1
});

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    let radius = circleWidth * 5, offset;
    const cx = width * 0.5;
    const cy = height * 0.5;
    for(let i = 0; i < circles; i++) {
      offset = quadIn(1 - i / circles) * 500;
      context.beginPath();
      context.ellipse(cx, cy + offset, radius, radius * 0.75, 0, 0, Math.PI * 2);
      context.lineWidth = circleWidth;
      context.strokeStyle = colors[i];
      context.stroke();
      radius += circlePadding * 2;
    }
    for(let i = 0; i < circles; i++) {
      context.beginPath();
      context.ellipse(cx, cy, radius, radius * 0.75, 0, 0, Math.PI * 2);
      context.lineWidth = circleWidth;
      context.strokeStyle = colors[circles - 1];
      context.stroke();
      radius += circlePadding * 2;
    }
  };
};

canvasSketch(sketch, settings);
