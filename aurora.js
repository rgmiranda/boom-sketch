const canvasSketch = require('canvas-sketch');
const { parse, style, offsetHSL } = require('canvas-sketch-util/color');
const { mapRange } = require('canvas-sketch-util/math');
const { noise2D, getRandomSeed, setSeed, rangeFloor, range, chance, noise3D } = require('canvas-sketch-util/random');
const createColorMap = require('colormap');

const cvWidth = 1080;
const cvHeight = 1080;

const numPoints = 8;
const pointSpeed = 5;
const noiseFreq = 0.01;
const noiseSeed = getRandomSeed();

const nshades = 32;
const colormap = 'plasma';
const colors = createColorMap({
  colormap,
  nshades,
  format: 'rgbaString',
  alpha: [1, 0]
});

const settings = {
  dimensions: [cvWidth, cvHeight],
  name: `aurora-${noiseSeed}`,
  animate: true
};

setSeed(noiseSeed);

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 */
function drawLine(context, x, y) {
  context.save();

  const auroraHeight = rangeFloor(350, 450);
  const gradient = context.createLinearGradient(x, y, x, y - auroraHeight);
  for (let j = 0; j < colors.length; j++) {
    gradient.addColorStop(j / (colors.length - 1), colors[j]);
  }
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x, y - auroraHeight);
  context.closePath();
  context.strokeStyle = gradient;
  context.stroke();

  context.restore();
}


const sketch = ({ width, height, context }) => {
  const points = Array(numPoints).fill(0).map(() => ({
    x: 0,
    y: rangeFloor(0, height)
  }))
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  return ({ context, frame }) => {
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const angle = noise3D(point.x, point.y, frame, noiseFreq, Math.PI);
      drawLine(context, point.x, point.y);
      point.x += Math.cos(angle) * pointSpeed;
      point.y += Math.sin(angle) * pointSpeed;
    }
  };
};

canvasSketch(sketch, settings);
