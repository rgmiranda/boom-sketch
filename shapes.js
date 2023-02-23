const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

const cvWidth = cvHeight = 500;

const colors = ["#233d4d", "#fe7f2d", "#fcca46", "#a1c181", "#619b8a"]

const preload = p5 => {
};

const settings = {
  p5: { p5, preload },
  dimensions: [cvWidth, cvHeight],
  //animate: true
};

canvasSketch(() => {
  // Return a renderer, which is like p5.js 'draw' function
  return ({ p5, time, width, height }) => {
    // Draw with p5.js things
    p5.background(colors[0]);

    //p5.noStroke();

    p5.fill(colors[1]);
    p5.rect(50, 50, 200, 400);

    p5.fill(colors[2]);
    p5.rect(250, 50, 200, 200);

    p5.fill(colors[3]);
    p5.rect(250, 250, 100, 100);
    p5.rect(350, 350, 100, 100);

    p5.fill(colors[4]);
    p5.rect(250, 350, 100, 100);
    p5.rect(350, 250, 100, 100);

  };
}, settings);
