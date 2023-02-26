const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');

const cvWidth = cvHeight = 1080;
const rows = 10;
const cols = 10;
const margin = 50;
const pw = (cvWidth - 2 * margin) / cols;
const ph = (cvHeight - 2 * margin) / rows;
const bg = '#F2EECB';
const fg = [
  '#ff665e',
  '#00a95c',
  '#0078bf',
];


const settings = {
  dimensions: [cvWidth, cvHeight]
};

const sketch = async () => {

  return ({ context, width, height }) => {
    const cx = width * 0.5;
    const cy = height * 0.5;

    let x, y, dx, dy, ox, oy;

    const maxDx = width - cx;
    const maxDy = height - cy;

    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < rows * cols; i++) {
      x = margin + (i % cols) * pw + pw * 0.5;
      y = margin + Math.floor(i / cols) * ph + ph * 0.5;
      dx = cx - x;
      dy = cy - y;

      ox = mapRange(dx, -maxDx, maxDx, pw * 0.3, -pw * 0.3);
      oy = mapRange(dy, -maxDy, maxDy, ph * 0.3, -ph * 0.3);

      for (let i = 0; i < fg.length; i++) {
        context.save();
  
        context.globalAlpha = 0.8 ** i;
        context.fillStyle = fg[i];
        context.beginPath();
        context.arc(x + ox * i, y + oy * i, pw * 0.2 + (i * 10), 0, Math.PI * 2);
        context.fill();
  
        context.restore();
      }


    }
  };
};

canvasSketch(sketch, settings);
