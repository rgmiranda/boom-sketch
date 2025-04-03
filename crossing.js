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
 */
const drawHorizontalLines = (context, width, height, horizon) => {
  const ratio = 2;
  let linePad = 1;
  context.strokeStyle = 'magenta';
  
  for (let y = horizon; y < height; y += linePad) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
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
  const speed = 5;
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
    context.beginPath();
    context.moveTo(bgx, bgy);
    context.lineTo(fgx, fgy);
    context.strokeStyle = 'magenta';
    context.stroke();
  }
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width  
 * @param { number } horizon 
 */
const drawSky = (context, width, horizon) => {
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, horizon);
}

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } mid 
 * @param { number } frame  
 */
const drawHorizon = (context, width, height, mid, frame) => {
  const step = 1;
  const freq = 0.0025;
  const amp = 100;
  
  let y;
  context.beginPath();
  context.moveTo(0, height);
  for (let x = 0; x < width + step; x += step) {
    y = mid
     + random.noise1D(x - frame, freq, amp)
     + random.noise1D(x - frame, freq * 12.5, amp * 0.05)
     ;
    context.lineTo(x, y);
  }
  context.lineTo(width, height);
  context.closePath();
  context.fillStyle = 'black';
  context.fill();
};

const sketch = ({ width, height, context }) => {
  const origin = new Vector(width * 0.5, height * 0.45);
  const horizon = height * 0.475;
  const linePad = 50;

  gradient = context.createLinearGradient(width * 0.5, 0, width * 0.5, horizon);
  colors.forEach((c, i, a) => {
    gradient.addColorStop(i / (a.length - 1), c)
  });
  return ({ context, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    drawSky(context, width, horizon);
    drawHorizon(context, width, height, height * 0.35, frame);
    drawHorizontalLines(context, width, height, horizon);
    drawVerticalLines(context, width, height, origin, horizon, linePad, frame);
    
  };
};

canvasSketch(sketch, settings);
