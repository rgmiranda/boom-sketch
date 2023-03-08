const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

const cvWidth = cvHeight = 1080;
const rows = 16;
const cols = 16;
const margin = 30;
const pw = (cvWidth - 2 * margin) / cols;
const ph = (cvHeight - 2 * margin) / rows;
const bg = 'black';
const fg = 'white';


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

    p5.fill(fg);
    
    p5.noStroke();

    let x, y, rand;

    for (let i = 0; i < rows * cols; i++) {
      x = (i % cols) * pw + margin;
      y = Math.floor(i / cols) * ph + margin;
      rand = p5.random();
      if (rand < 0.25) {
        p5.rect(x, y, pw * 0.5, ph);
      } else if (rand < 0.5) {
        p5.rect(x, y, pw, ph * 0.5);
      } else if (rand < 0.75) {
        p5.rect(x + pw * 0.5, y, pw * 0.5, ph);
      } else {
        p5.rect(x, y + ph * 0.5, pw, ph * 0.5);
      }
    }
  };
}, settings);
