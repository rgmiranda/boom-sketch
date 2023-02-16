const canvasSketch = require('canvas-sketch');
const { offsetHSL } = require('canvas-sketch-util/color');
const { rangeFloor, pick, getRandomSeed, setSeed } = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const cvWidth = cvHeight = 1080;
const seed = getRandomSeed();
setSeed(seed);
const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name: seed,
};
const colors = Array(4).fill().map(() => pick(risoColors).hex);
const rows = 10;
const cols = 10;
const padding = 10;
const sqWidth = (cvWidth - padding) / cols;
const sqHeight = (cvHeight - padding) / rows;
const points = Array(rows * cols).fill(false);
const circles = 15;

const sketch = ({ context, width, height }) => {
  let i, x, y, mw, w, h, color;
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);
  
  context.globalAlpha = 0.7;
  
  i = 0;
  while (i < rows * cols) {
    if (points[i]) {
      i++;
      continue;
    }
    x = i % cols;
    y = Math.floor(i / cols);
    mw = rangeFloor(2, Math.min(5, cols - x));
    w = 1;
    while (w < mw && !points[i + w]) {
      w++;
    }
    h = rangeFloor(1, Math.min(5, rows - y));
    
    for (let j = 0; j < w * h; j++) {
      points[i + Math.floor(j / w) * cols + (j % w)] = true;
    }
    
    color = pick(colors);
    context.fillStyle = color;
    context.strokeStyle = offsetHSL(color, 0, 0, -20);
    context.beginPath();
    context.rect(x * sqWidth + padding, y * sqHeight + padding, w * sqWidth - padding, h * sqHeight - padding);
    context.fill();
    i++;
  }
  
  context.globalAlpha = 0.4;
  context.globalCompositeOperation = 'color-burn';
  for (i = 0; i < circles; i++) {
    x = rangeFloor(0, width);
    y = rangeFloor(0, height);
    w = rangeFloor(50, 150);
    context.beginPath();
    context.arc(x, y, w, 0, Math.PI * 2);
    context.fillStyle = pick(colors);
    context.fill();
  }
  return () => {
  };
};

canvasSketch(sketch, settings);
