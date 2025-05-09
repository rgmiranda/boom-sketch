const { Vector, Line } = require('@rgsoft/math');
const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'crossing',
  animate: true,
};

/** @type { CanvasGradient } */
let gradient;

const colors = createColormap({
  nshades: 24,
  colormap: 'magma',
})

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } horizon 
 * @param { number } origin 
 */
const drawHorizontalLines = (context, width, height, horizon, origin) => {
  const ratio = 1.25;
  let linePad = 1;
  context.strokeStyle = 'white';
  
  for (let y = horizon; y < height; y += linePad) {

    const dyo = y - origin.y;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();

    context.beginPath();
    context.moveTo(0, origin.y - dyo);
    context.lineTo(width, origin.y - dyo);
    context.stroke();
    linePad *= ratio;
  }
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { Vector } origin 
 * @param { number } horizon 
 * @param { number } linePad 
 * @param { number } frame 
 */
const drawVerticalLines = (context, width, height, origin, horizon, linePad, frame) => {
  const bgy = horizon;
  const speed = 1;
  for (let bgx = (frame * speed) % linePad; bgx < width; bgx += linePad) {
    const bgOrigin = new Vector(bgx, bgy);
    const line = Line.fromPoints(origin, bgOrigin);
    let fgy = height;
    let fgx;
    if (isNaN(line.m)) {
      fgx = bgx;
    } else {
      fgx = (fgy - line.a) / line.m;
      if (fgx < 0) {
        fgx = 0;
        fgy = line.m * fgx + line.a;
      } else if (fgx > width) {
        fgx = width;
        fgy = line.m * fgx + line.a;
      }
    }
    const dyo = Math.abs(horizon - origin.y);
    context.beginPath();
    context.moveTo(bgx, bgy);
    context.lineTo(fgx, fgy);
    context.strokeStyle = 'white';
    context.stroke();

    context.beginPath();
    context.moveTo(bgx, origin.y - dyo);
    context.lineTo(fgx, height - fgy);
    context.strokeStyle = 'white';
    context.stroke();
  }
};


const sketch = ({ width, height, context }) => {
  const origin = new Vector(width * 0.5, height * 0.5);
  const horizon = height * 0.525;
  const linePad = 25;

  gradient = context.createLinearGradient(width * 0.5, 0, width * 0.5, horizon);
  colors.forEach((c, i, a) => {
    gradient.addColorStop(i / (a.length - 1), c)
  });
  frame = 0;
  return ({ context }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    drawHorizontalLines(context, width, height, horizon, origin);
    drawVerticalLines(context, width, height, origin, horizon, linePad, frame);
    frame++;
  };
};

canvasSketch(sketch, settings);
