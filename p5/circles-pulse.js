const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

const cvWidth = cvHeight = 1080;
const rows = 32;
const cols = 32;
const margin = 20;
const pw = (cvWidth - 2 * margin) / cols;
const ph = (cvHeight - 2 * margin) / rows;
const bg = 'black';
const fg = 'white';
const freq = -0.05;


const preload = p5 => {
  // You can use p5.loadImage() here, etc...
};

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  dimensions: [cvWidth, cvHeight],
  // Turn on a render loop
  animate: true
};

canvasSketch(() => {
  // Return a renderer, which is like p5.js 'draw' function
  return ({ p5, frame, width, height }) => {
    const cx = width * 0.5;
    const cy = height * 0.5;
    const maxDist = (width - cx) * (width - cx) + (height - cy) * (height - cy);
    // Draw with p5.js things
    p5.background(bg);

    p5.fill(fg);
    p5.noStroke();

    let x, y, r, dx, dy, dist, disp;

    for (let i = 0; i < rows * cols; i++) {
      x = (i % cols) * pw + pw * 0.5 + margin;
      y = Math.floor(i / cols) * ph + ph * 0.5 + margin;
      dx = cx - x;
      dy = cy - y;
      dist = dx * dx + dy * dy;
      disp = p5.map(dist, 0, maxDist, 0, 8 * p5.PI);

      r = p5.sin(frame * freq + disp) * pw;

      p5.circle(x, y, r);
    }
  };
}, settings);
