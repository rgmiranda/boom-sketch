const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { noise2D, rangeFloor, noise1D, getRandomSeed, setSeed } = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const eases = require('eases');

const seed = getRandomSeed();
setSeed(seed);
const numLines = 128;
const numPoints = 1080;
const noiseScale = 0.005;
const noiseAmp = 100;
const settings = {
  dimensions: [ 1080, 1080 ],
  name: `terrain-${seed}`
};
const colors = createColormap({
  colormap: 'plasma',
  nshades: numLines,
  format: 'hex',
  alpha: 1,
});

const lines = [];

const sketch = ({ width, height }) => {
  let linePadding = height / (numLines + 1);
  const pointPadding = width / (numPoints - 1);
  let scaleDamp;
  for (let i = 0; i < numLines; i++) {
    const line = [];
    let offset;
    const noiseOffset = rangeFloor(0, numLines) * 100;
    const fromPoint = 250;
    const toPoint = numPoints - fromPoint;
    for (let j = 0; j < numPoints; j++) {
      if ( j < fromPoint || j > toPoint ) {
        scaleDamp = 0.04;
      } else {
        scaleDamp = Math.max(0.04, eases.cubicIn(4 * (1 - ((j - fromPoint) / (toPoint - fromPoint))) * ((j - fromPoint) / (toPoint - fromPoint))));
      }
      offset = noise2D(noiseOffset + i, noiseOffset + j - numPoints * 0.5, noiseScale, noiseAmp * scaleDamp) - noiseAmp * scaleDamp;
      line.push([j * pointPadding, ( i + 1 ) * linePadding + offset]);
    }
    lines.push(line);
;
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'white';
    context.lineWidth = 1;

    for (let i = 0; i < numLines; i++) {
      let x, y;
      context.beginPath();
      for (let j = 0; j < numPoints; j++) {
        ([x, y] = lines[i][j])
        if (j === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.strokeStyle = 'white';
      context.lineWidth = 4;
      context.stroke();
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();
      context.fill();
    }
  };
};

canvasSketch(sketch, settings);
