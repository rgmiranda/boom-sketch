const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const p5 = require('p5');
const eases = require('eases');

const cvWidth = cvHeight = 1080;
const rows = 64;
const cols = 64;
const margin = 2;
const cellPadding = margin;
const pw = (cvWidth - 2 * margin) / cols;
const ph = (cvHeight - 2 * margin) / rows;
const bg = 'black';

const colors = createColormap({
  colormap: 'bone',
  nshades: 64,
  format: 'hex',
  alpha: 1
});

const preload = p5 => {
  // You can use p5.loadImage() here, etc...
};

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  dimensions: [cvWidth, cvHeight],
};

canvasSketch(() => {
  // Return a renderer, which is like p5.js 'draw' function
  return ({ p5 }) => {
    p5.background(bg);

    p5.noStroke();

    let x, y, rand;

    for (let i = 0; i < rows * cols; i++) {
      x = (i % cols) * pw + margin + pw * 0.5;
      y = Math.floor(i / cols) * ph + margin + ph * 0.5;
      rand = p5.random();

      if (rand < Math.floor(i / cols) / rows) {
        continue;
      }

      p5.fill(colors[p5.floor(p5.random() * colors.length)]);
      p5.push();

      p5.translate(x, y);
      p5.rect(-pw * 0.5 + cellPadding, -ph * 0.5 + cellPadding, pw - cellPadding * 2, ph - cellPadding * 2, cellPadding * 2);

      p5.pop();
    }
  };
}, settings);
