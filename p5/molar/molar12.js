const canvasSketch = require('canvas-sketch');
const { pick, permuteNoise } = require('canvas-sketch-util/random');
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


const preload = p5 => {
  // You can use p5.loadImage() here, etc...
};

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  dimensions: [cvWidth, cvHeight],
};

const angles = [
  0,
  Math.PI * 0.5,
  Math.PI,
  Math.PI * 1.5
];

const patterns = [
  (p5, w, h) => {
    p5.arc(-w * 0.5, -h * 0.5, w * 0.5, h * 0.5, 0, p5.PI * 0.5);
    p5.arc(-w * 0.5, -h * 0.5, w, h, 0, p5.PI * 0.5);
    
    p5.arc(-w * 0.5, h * 0.5, w * 0.5, h * 0.5, -p5.PI * 0.5, 0);

    p5.arc(w * 0.5, h * 0.5, w * 0.5, h * 0.5, -p5.PI, -p5.PI * 0.5);
    p5.arc(w * 0.5, h * 0.5, w, h, -p5.PI, -p5.PI * 0.5);
    
    p5.arc(w * 0.5, -h * 0.5, w * 0.5, h * 0.5, p5.PI * 0.5, p5.PI);
  },
  (p5, w, h) => {
    p5.arc(-w * 0.5, -h * 0.5, w * 0.5, h * 0.5, 0, p5.PI * 0.5);
    p5.arc(-w * 0.5, -h * 0.5, w, h, 0, p5.PI * 0.5);
    p5.arc(-w * 0.5, -h * 0.5, w * 1.5, h * 1.5, 0, p5.PI * 0.5);
    
    p5.arc(w * 0.5, h * 0.5, w * 0.5, h * 0.5, -p5.PI, -p5.PI * 0.5);
    
    p5.arc(w * 0.5, - h * 0.125, w * 0.25, h * 0.25, p5.PI * 0.5, p5.PI * 1.5);
    
    p5.arc(- w * 0.125, h * 0.5, w * 0.25, h * 0.25, p5.PI, p5.PI * 2);
    
  },
  (p5, w, h) => {
    p5.arc(-w * 0.5, -h * 0.5, w * 0.5, h * 0.5, 0, p5.PI * 0.5);
    p5.arc(w * 0.5, h * 0.5, w * 0.5, h * 0.5, -p5.PI, -p5.PI * 0.5);
    
    p5.arc(w * 0.125, - h * 0.125, w * 0.25, h * 0.25, p5.PI * 0.5, p5.PI * 1.5);
    p5.line(w * 0.125, -h * 0.25, w * 0.5, - h * 0.25);
    p5.line(w * 0.125, 0, w * 0.5, 0);
    
    p5.arc(- w * 0.125, h * 0.5, w * 0.25, h * 0.25, p5.PI, p5.PI * 2);
    p5.line(-w * 0.125, h * 0.25, -w * 0.5, h * 0.25);
    p5.line(-w * 0.125, 0, -w * 0.5, 0);

    p5.arc(w * 0.125, - h * 0.5, w * 0.25, h * 0.25, 0, p5.PI);
    p5.arc(- w * 0.125, h * 0.125, w * 0.25, h * 0.25, -p5.PI * 0.5, p5.PI * 0.5);
    
  },
  (p5, w, h) => {
    p5.arc(-w * 0.5, -h * 0.5, w * 0.5, h * 0.5, 0, p5.PI * 0.5);
    p5.arc(w * 0.5, h * 0.5, w * 0.5, h * 0.5, -p5.PI, -p5.PI * 0.5);
    
    p5.arc(- w * 0.125, h * 0.5, w * 0.25, h * 0.25, p5.PI, p5.PI * 2);
    p5.arc(w * 0.125, - h * 0.5, w * 0.25, h * 0.25, 0, p5.PI);

    p5.beginShape();
    p5.vertex(-w * 0.5, 0);
    p5.bezierVertex(w * 0.125, 0, -w * 0.125, -h * 0.25, w * 0.5, -h * 0.25);
    p5.endShape();

    p5.beginShape();
    p5.vertex(-w * 0.5, h * 0.25);
    p5.bezierVertex(w * 0.125, h * 0.25, -w * 0.125, 0, w * 0.5, 0);
    p5.endShape();
    
  },
]

canvasSketch(() => {
  // Return a renderer, which is like p5.js 'draw' function
  return ({ p5 }) => {
    p5.background(bg);

    p5.stroke(fg);
    p5.noFill();
    p5.strokeWeight(lineWidth);

    let x, y, angle, pattern;

    for (let i = 0; i < rows * cols; i++) {
      x = (i % cols) * pw + pw * 0.5 + margin;
      y = Math.floor(i / cols) * ph + ph * 0.5 + margin;
      pattern = pick(patterns);
      angle = pick(angles);
      
      p5.push();

      p5.translate(x, y);
      p5.rotate(angle);
      pattern(p5, pw, ph);

      p5.pop();
      //break;
    }
  };
}, settings);
