const canvasSketch = require('canvas-sketch');
const { range, noise1D } = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const { circOut } = require('eases');

const cvWidth = cvHeight = 1080;
const radius = cvWidth * 0.48;
const noiseAmp = 125;
const noiseFreq = 0.1;
const cols = 1024;
const settings = {
  dimensions: [ cvWidth, cvHeight ]
};
const colors = createColormap({
  colormap: [
    {
      index: 0,
      rgb: [48, 48, 48]
    },
    {
      index: 1,
      rgb: [255, 255, 255]
    }
  ],
  nshades: cols,
  format: 'hex',
  alpha: 1,
});

const columns = [];

const sketch = ({ width, height }) => {
  let x, h, color, offset, circleRatio;
  for (let i = 0; i < cols; i++) {
    x = range(width * 0.5 - radius, width * 0.5 + radius);
    circleRatio = circOut(1 - Math.abs(x - width * 0.5) / radius);
    offset = (noise1D(x, noiseFreq, noiseAmp) - noiseAmp) * circleRatio;
    h = range(0, (1 - i / cols) * height) * circleRatio;
    color = colors[i];
    columns.push({ x, h, color, offset });
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'white';
    context.beginPath();
    context.arc(width * 0.5, height * 0.5, radius, -Math.PI, 0);
    context.closePath();
    context.fill();

    context.lineWidth = 5;
    for (const column of columns) {
      context.strokeStyle = column.color;
      context.beginPath();
      context.moveTo(column.x, height * 0.5 + column.offset);
      context.lineTo(column.x, height * 0.5 + column.h);
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
