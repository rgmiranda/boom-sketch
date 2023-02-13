const canvasSketch = require('canvas-sketch');
const { pick } = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');

const cvWidth = cvHeight = 1080;
const rows = 64;
const cols = 64;
const pw = cvWidth / cols;
const ph = cvHeight / rows;
const bg = 'black';
const fg = 'white';

const colors = [
  pick(risoColors).hex,
  pick(risoColors).hex,
  pick(risoColors).hex,
  pick(risoColors).hex,
];

const settings = {
  dimensions: [cvWidth, cvHeight]
};

const displayers = [
  (context, x, y) => {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + pw, y + ph);
    context.stroke();
  },
  (context, x, y) => {
    context.beginPath();
    context.moveTo(x + pw, y);
    context.lineTo(x, y + ph);
    context.stroke();
  },
  (context, x, y) => {
    context.beginPath();
    context.moveTo(x, y + ph * 0.5);
    context.lineTo(x + pw, y + ph * 0.5);
    context.stroke();
  },
  (context, x, y) => {
    context.beginPath();
    context.moveTo(x + pw * 0.5, y);
    context.lineTo(x + pw * 0.5, y + ph);
    context.stroke();
  },
];

const sketch = async () => {

  return ({ context, width, height }) => {
    let x, y;
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);
    context.lineWidth = 3;
    context.lineCap = 'round';
    
    for (let i = 0; i < rows * cols; i++) {
      context.strokeStyle = pick(colors);
      x = (i % cols) * pw;
      y = Math.floor(i / cols) * ph;
      pick(displayers)(context, x, y);
    }
  };
};

canvasSketch(sketch, settings);
