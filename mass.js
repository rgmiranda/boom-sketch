const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'the-mass',
};

//const colors = ['#ff4800', '#ff5400', '#ff6000', '#ff6d00', '#ff7900', '#ff8500', '#ff9100', '#ff9e00', '#ffaa00', '#ffb600']


const initLineWidth = 5;
const initRadius = 250;
const step = 5;
const noiseFreq = 0.05;
const noiseAmp = Math.PI;
const maxLength = 120;
const numStrings = Math.floor(1.5 * 2 * Math.PI * initRadius / initLineWidth);
const angleStep = 2 *  Math.PI / numStrings;
const colors = createColormap({
  nshades: maxLength,
  colormap: 'magma'
}).reverse();

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } i
 */
const drawString = (ctx, i) => {
  let px, py, nx, ny, angle;
  px = initRadius;
  py = 0;
  ctx.lineCap = 'round';
  for (let j = 0; j < maxLength; j ++) {
    angle = random.noise2D(i, j, noiseFreq, noiseAmp);
    ctx.lineWidth = math.mapRange(j, 0, maxLength - 1, initLineWidth, 0, true);
    ctx.strokeStyle = colors[j];
    nx = px + Math.cos(angle) * step;
    ny = py + Math.sin(angle) * step;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    px = nx;
    py = ny;
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    for (let i = 0; i < numStrings; i++) {
      drawString(context, i * 2);
      context.rotate(angleStep);
    }
  };
};

canvasSketch(sketch, settings);
