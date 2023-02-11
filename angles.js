const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { rangeFloor, range, getRandomSeed, setSeed } = require('canvas-sketch-util/random');
const createColormap = require('colormap');

const cvWidth = 1080, cvHeight = 1080;
const bg = '#000';
const fg = '#00F';
const numSlices = 32;
const angle = 2 * Math.PI / numSlices;
const colormap = 'cool';
const nshades = numSlices;
const randomSeed = getRandomSeed();

const arcsColors = createColormap({
  colormap,
  nshades,
  format: 'hex',
  alpha: 1
})

const settings = {
  dimensions: [cvWidth, cvHeight],
  name: randomSeed,
};

const sketch = () => {
  setSeed(randomSeed);
  return ({ context, width, height }) => {
    let currAngle, radius, lineWidth, rectHeight, rectWidth, rectRadius, arcColor;
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < numSlices; i++) {
      currAngle = i * angle;
      radius = rangeFloor(width * 0.1, width * 0.5);
      arcColor = arcsColors[Math.floor(mapRange(radius, width * 0.1, width * 0.45, 0, nshades))];
      lineWidth = rangeFloor(2, 5);
      rectHeight = rangeFloor(width * 0.2, width * 0.3);
      rectRadius = rangeFloor(width * 0.1, width * 0.2);
      rectWidth = rangeFloor(2, 10);

      context.save();

      context.translate(width * 0.5, height * 0.5);
      context.rotate(currAngle);

      context.fillStyle = fg;
      
      context.fillRect(
        -rectWidth * 0.5,
        rectHeight - rectRadius * 0.5,
        rectWidth,
        rectHeight
      );

      context.beginPath();
      context.arc(0, 0, radius, range(-Math.PI, 0), range(0, Math.PI));
      context.lineWidth = lineWidth;
      context.strokeStyle = arcColor;

      context.stroke();

      context.restore();
    } 
  };
};

canvasSketch(sketch, settings);
