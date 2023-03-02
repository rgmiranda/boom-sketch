const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

const cvWidth = cvHeight = 1080;
const rows = 8;
const cols = 8;
const margin = 25;
const pw = (cvWidth - 2 * margin) / cols;
const ph = (cvHeight - 2 * margin) / rows;
const bg = 'black';
const fg = 'white';
const lineWidth = 6;
const numLines = 5;
const lineXPadding = pw / numLines;
const lineYPadding = ph / numLines;


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

    p5.stroke(fg);
    p5.noFill();
    p5.strokeWeight(lineWidth);

    let x, y, rand;

    for (let i = 0; i < rows * cols; i++) {
      x = (i % cols) * pw + margin;
      y = Math.floor(i / cols) * ph + margin;
      rand = p5.random();
      if (rand < 0.25) {
        for (let j = 0; j < numLines; j++) {
          p5.line(x, y + j * lineYPadding, x + pw - j * lineXPadding, y + j * lineYPadding);
          p5.line(x + pw - j * lineXPadding, y + j * lineYPadding, x + pw - j * lineXPadding, y + ph);
        }
      } else if (rand < 0.5) {
        for (let j = 0; j < numLines; j++) {
          p5.line(x, y + ph - j * lineYPadding, x + pw - j * lineXPadding, y + ph - j * lineYPadding);
          p5.line(x + pw - j * lineXPadding, y + ph - j * lineYPadding, x + pw - j * lineXPadding, y);
        }
      } else if (rand < 0.75) {
        for (let j = 0; j < numLines; j++) {
          p5.line(x + j * lineXPadding, y, x + j * lineXPadding, y + ph - j * lineYPadding);
          p5.line(x + j * lineXPadding, y + ph - j * lineYPadding, x + pw, y + ph - j * lineYPadding);
        }
      } else {
        for (let j = 0; j < numLines; j++) {
          p5.line(x, y + ph - j * lineYPadding, x + pw - j * lineXPadding, y + ph - j * lineYPadding);
          p5.line(x + pw - j * lineXPadding, y + ph - j * lineYPadding, x + pw - j * lineXPadding, y);
        }
      }
    }
  };
}, settings);
