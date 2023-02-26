const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { chance, pick } = require('canvas-sketch-util/random');

const cvWidth = cvHeight = 1080;
const rows = 10;
const cols = 10;
const margin = 50;
const pw = (cvWidth - 2 * margin) / cols;
const ph = (cvHeight - 2 * margin) / rows;
const bg = '#F2EECB';
const fg = '#1E293B';


const settings = {
  dimensions: [cvWidth, cvHeight]
};

const circles = Array(rows * cols).fill(0).map(() => chance(0.65) ? 0 : 1);
const connections = Array(rows * cols).fill(-1);


const sketch = async () => {
  
  connections.forEach((v, i, arr) => {
    if (!circles[i]) {
      return;
    }
    if (v !== -1) {
      return;
    }
    if (chance(0.65)) {
      return;
    }
    const nodes = [
      i - cols - 1,
      i - cols + 1,
      i + cols - 1,
      i + cols + 1,
    ].filter(j => {
      return j > 0
        && j < rows * cols
        && circles[j]
        && Math.abs(Math.floor(j / cols) - Math.floor(i / cols)) === 1
        && arr[j] === -1;
    });
    if (nodes.length > 0) {
      arr[i] = pick(nodes);
      arr[arr[i]] = i;
    }
  });

  return ({ context, width, height }) => {

    let x, y, cx, cy, j;

    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);
    context.fillStyle = fg;
    context.strokeStyle = fg;

    for (let i = 0; i < rows * cols; i++) {
      x = margin + (i % cols) * pw + pw * 0.5;
      y = margin + Math.floor(i / cols) * ph + ph * 0.5;

      if (!circles[i]) {
        continue;
      }

      context.save();

      context.beginPath();
      context.arc(x, y, pw * 0.48, 0, Math.PI * 2);
      context.fill();

      context.restore();

      if (connections[i] === -1) {
        continue;
      }

      j = connections[i];
      cx = margin + (j % cols) * pw + pw * 0.5;
      cy = margin + Math.floor(j / cols) * ph + ph * 0.5;

      console.log(cx, cy);
      
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(cx, cy);
      context.stroke();

    }
  };
};

canvasSketch(sketch, settings);
