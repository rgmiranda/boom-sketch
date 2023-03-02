const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

const cvWidth = cvHeight = 1080;
const rows = 16;
const cols = 16;
const margin = 25;
const pw = (cvWidth - 2 * margin) / cols;
const ph = (cvHeight - 2 * margin) / rows;
const bg = 'black';
const fg = 'white';
const lineWidth = 8;


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
      if (rand < 0.35) {
        p5.arc(x, y, pw, ph, 0, Math.PI * 0.5);
        p5.arc(x + pw, y + ph, pw, ph, Math.PI, Math.PI * 1.5);
      } else if (rand < 0.70) {
        p5.arc(x + pw, y, pw, ph, Math.PI * 0.5, Math.PI);
        p5.arc(x, y + ph, pw, ph, Math.PI * 1.5, Math.PI * 2);
      } else {
        p5.arc(x, y, pw, ph, 0, Math.PI * 0.5);
        p5.arc(x + pw, y + ph, pw, ph, Math.PI, Math.PI * 1.5);
        p5.arc(x + pw, y, pw, ph, Math.PI * 0.5, Math.PI);
        p5.arc(x, y + ph, pw, ph, Math.PI * 1.5, Math.PI * 2);
      }
    }
  };
}, settings);
