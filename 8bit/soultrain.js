const canvasSketch = require('canvas-sketch');
const { rangeFloor, pick } = require('canvas-sketch-util/random');

const cvWidth = cvHeight = 1080;
const rows = 10;
const cols = 10;
const pw = cvWidth / cols;
const ph = cvHeight / rows;
const bg = 'brown';//;'#EEEAE0';

/** @type { CanvasGradient } */
let linearFg;

/** @type { CanvasGradient } */
let radialFg;

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

const squaresDisplayers = [

  (ctx, x, y, w, h, p) => {
    
  },

  (ctx, x, y, w, h, p) => {
    const rx = x + p * 0.5;
    const ry = y + p * 0.5;
    const rw = w - p;
    const rh = h - p;

    const angles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];

    ctx.save();
    ctx.translate(rx + rw * 0.5, ry + rh * 0.5);
    ctx.rotate(pick(angles));
    ctx.beginPath();
    ctx.fillStyle = linearFg;
    ctx.fillRect(-rw * 0.5, -rh * 0.5, rw, rh);
    ctx.restore();
    
  },
  
  (ctx, x, y, w, h, p) => {
    const rx = x + p * 0.5;
    const ry = y + p * 0.5;
    const rw = w - p;
    const rh = h - p;
    
    const angles = [0, Math.PI * 0.5, Math.PI , Math.PI * 1.5];
    
    ctx.save();
    ctx.translate(rx + rw * 0.5, ry + rh * 0.5);
    ctx.rotate(pick(angles));
    ctx.beginPath();
    ctx.moveTo(-rw * 0.5, -rh * 0.5);
    ctx.arc(-rw * 0.5, -rh * 0.5, rw, 0, Math.PI * 0.5);
    ctx.closePath();
    ctx.fillStyle = radialFg;
    ctx.fill();

    ctx.restore();
  },
];

const sketch = async () => {
  
  return ({ context, width, height }) => {
    let x, y;
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    linearFg = context.createLinearGradient(-pw * 0.5, ph * 0.5, pw * 0.5, ph * 0.5);
    linearFg.addColorStop(0.33, 'yellow');
    linearFg.addColorStop(0.34, 'orange');
    linearFg.addColorStop(0.66, 'orange');
    linearFg.addColorStop(0.67, 'red');

    radialFg = context.createRadialGradient(-pw * 0.5, -ph * 0.5, 0, -pw * 0.5, -ph * 0.5, (pw + ph) * 0.5);
    radialFg.addColorStop(0.33, 'yellow');
    radialFg.addColorStop(0.34, 'orange');
    radialFg.addColorStop(0.66, 'orange');
    radialFg.addColorStop(0.67, 'red');

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
