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

    p5.fill(fg);
    p5.noStroke();

    let x, y, rand;

    for (let i = 0; i < rows * cols; i++) {
      x = (i % cols) * pw + margin;
      y = Math.floor(i / cols) * ph + margin;
      rand = p5.random();
      if (rand < 0.25) {
        p5.beginShape();
        p5.vertex(x, y);
        p5.quadraticVertex(x + pw, y, x + pw, y + ph);
        p5.quadraticVertex(x, y + ph, x, y);
        p5.endShape();
      } else if (rand < 0.5) {
        p5.beginShape();
        p5.vertex(x + pw, y);
        p5.quadraticVertex(x + pw, y + ph, x, y + ph);
        p5.quadraticVertex(x, y, x + pw, y);
        p5.endShape();
      } else {
        //p5.ellipse(x + pw * 0.5, y + ph * 0.5, pw * 0.6, ph * 0.6);
      }
    }
  };
}, settings);
