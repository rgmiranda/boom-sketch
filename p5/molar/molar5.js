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

    let x, y, cx, cy, rand;

    for (let i = 0; i < rows * cols; i++) {
      x = (i % cols) * pw + margin;
      y = Math.floor(i / cols) * ph + margin;
      cx = x + pw * 0.5;
      cy = y + ph * 0.5;

      rand = p5.random();
      p5.beginShape();
      if (rand < 0.5) {
        p5.vertex(x, y);
        p5.vertex(x + pw, y);
        p5.vertex(cx, cy);
        p5.vertex(x + pw, y + ph);
        p5.vertex(x, y + pw);
        p5.vertex(cx, cy);
      } else {
        p5.vertex(x, y);
        p5.vertex(x, y + ph);
        p5.vertex(cx, cy);
        p5.vertex(x + pw, y);
        p5.vertex(x + pw, y + pw);
        p5.vertex(cx, cy);
      } 
      p5.endShape(p5.CLOSE);
    }
  };
}, settings);
