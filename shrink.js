const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const { quadOut } = require('eases');
const p5 = require('p5');

const cvWidth = cvHeight = 1080;
const colormap = 'winter';
const reps = nshades = 128;
const colors = createColormap({
  colormap,
  nshades,
  format: 'hex',
  alpha: 1,
});
const finalAngle = Math.PI * 2;
const frames = 1; // ~6s
const frameAngleStep = finalAngle / frames;
let currFrame;

const preload = p5 => {
};

const settings = {
  p5: { p5, preload },
  dimensions: [cvWidth, cvHeight],
  //animate: true,
};

let sketchManager;

function addListeners() {
  window.addEventListener('click', () => {
    if (!sketchManager) {
      return;
    }
    if (sketchManager.props.playing){
      sketchManager.pause();
    } else {
      sketchManager.play();
    }
  });
}

canvasSketch(() => {
  addListeners();
  // Return a renderer, which is like p5.js 'draw' function
  return ({ p5, frame, width, height }) => {
    const startAngle = 0;
    const endAngle = (frame + 1) * frameAngleStep;
    const stepAngle = (endAngle - startAngle) / reps;
    const startSize = width * 0.95;
    const endSize = width * 0.1;
    const stepSize = (endSize - startSize) / reps;

    let size, angle;
    p5.background('black');

    p5.noFill();
    p5.rectMode(p5.CENTER);
    angle = startAngle;
    size = startSize;
    
    for (let i = 0; i < reps; i ++) {
      p5.strokeWeight(p5.map(i, 0, reps, 1, 10));
      p5.strokeWeight(1);
      p5.push();

      p5.translate(width * 0.5, height * 0.5);
      p5.rotate(angle);
      p5.stroke(colors[i]);
      p5.ellipse(0, 0, size, size * 0.75);

      p5.pop();

      angle += stepAngle * ( 1 - quadOut(i / reps) );
      size += stepSize * ( 1 - quadOut(i / reps) );
    }
    p5.push();

    p5.translate(width * 0.5, height * 0.5);
    p5.rotate(angle);
    p5.stroke(colors[nshades - 1]);
    p5.ellipse(0, 0, size, size * 0.75);

    p5.pop();

    if (frame > frames && sketchManager) {
      sketchManager.pause();
    }

  };
}, settings).then(manager => sketchManager = manager);
