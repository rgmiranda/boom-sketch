const canvasSketch = require('canvas-sketch');
const { rangeFloor, pick } = require('canvas-sketch-util/random');

const cvWidth = cvHeight = 1080;
const rows = 10;
const cols = 10;
const pw = cvWidth / cols;
const ph = cvHeight / rows;
const bg = 'black';//;'#EEEAE0';
const fg = 'red';

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

const squaresDisplayers = [
  
  (ctx, x, y, w, h, p) => {
    
  },
  
  (ctx, x, y, w, h, p) => {
    const lineWidth = 0;
    const rx = x + p * 0.5 + lineWidth * 0.5;
    const ry = y + p * 0.5 + lineWidth * 0.5;
    const rw = w - p - lineWidth;
    const rh = h - p - lineWidth;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.rect(rx, ry, rw, rh);
    ctx.fill();
    ctx.stroke();

    
  },
  
  (ctx, x, y, w, h, p) => {
    const lineWidth = 0;
    const rx = x + p * 0.5 + lineWidth * 0.5;
    const ry = y + p * 0.5 + lineWidth * 0.5;
    const rw = w - p - lineWidth;
    const rh = h - p - lineWidth;
    ctx.lineWidth = lineWidth;

    const angles = [0, Math.PI * 0.5, Math.PI , Math.PI * 1.5];

    ctx.save();
    ctx.translate(rx + rw * 0.5, ry + rh * 0.5);
    ctx.rotate(pick(angles));
    ctx.beginPath();
    ctx.moveTo(-rw * 0.5, -rh * 0.5);
    ctx.arc(-rw * 0.5, -rh * 0.5, rw, 0, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  },
];

const sketch = async () => {
  
  return ({ context, width, height }) => {
    let x, y;
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = fg;
    context.fillStyle = fg;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        x = i * pw;
        y = j * ph;
        pick(squaresDisplayers)(context, x, y, pw, ph, 0);
      }
    }
  };
};

canvasSketch(sketch, settings);
