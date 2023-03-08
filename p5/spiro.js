const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const p5 = require('p5');
const { Pane } = require('tweakpane');

const cvWidth = cvHeight = 1080;
const bg = 'black';
const dim = cvWidth * 0.48;

const params = {
  times: 32,
  minDim: 0.3,
  angle: Math.PI / 180,
  lineWidth: 1,
  sides: 4,
  colormap: 'bone'
}
let fg = createColormap({
  colormap: params.colormap,
  nshades: params.times,
  format: 'hex',
  alpha: 1,
});

const pane = new Pane();
pane.addInput(params, 'times', {min: 12, max: 64, step: 1});
pane.addInput(params, 'angle', {min: Math.PI / 180, max: Math.PI / 18});
pane.addInput(params, 'minDim', {min: 0, max: 1});
pane.addInput(params, 'lineWidth', {min: 1, max: 8, step: 1});
pane.addInput(params, 'sides', {min: 3, max: 8, step: 1});
pane.addInput(params, 'colormap', {
  options: {
    bone: 'bone',
    winter: 'winter',
    plasma: 'plasma',
    magma: 'magma',
    cool: 'cool',
    hot: 'hot',
    hsv: 'hsv',
    jet: 'jet',
    rainbow: 'rainbow',
    copper: 'copper',
    inferno: 'inferno',
    warm: 'warm',
    bluered: 'bluered',
    spring: 'spring',
    'rainbow-soft': 'rainbow-soft',
  }
});

pane.on('change', (ev) => {
  if (ev.presetKey === 'times') {
    fg = createColormap({
      colormap: params.colormap,
      nshades: ev.value,
      format: 'hex',
      alpha: 1,
    });
  } else if (ev.presetKey === 'colormap') {
    fg = createColormap({
      colormap: ev.value,
      nshades: params.times,
      format: 'hex',
      alpha: 1,
    });
  }
  if (sketchManager) {
    sketchManager.render();
  }
});


const preload = p5 => {
  // You can use p5.loadImage() here, etc...
};

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  // Turn on a render loop
  dimensions: [cvWidth, cvHeight]
};

let sketchManager;

function drawShape(p5, sides, size) {
  let currentAngle = -p5.PI * 0.5;
  const angleStep = 2 * p5.PI / sides;
  p5.beginShape();
  for (let i = 0; i < sides; i++) {
    p5.vertex(p5.cos(currentAngle) * size, p5.sin(currentAngle) * size);
    currentAngle += angleStep;
  }
  p5.endShape(p5.CLOSE);
}

canvasSketch(() => {
  // Return a renderer, which is like p5.js 'draw' function
  return ({ p5, width, height }) => {
    let c;
    p5.background(bg);
    p5.noFill();
    p5.translate(width * 0.5, height * 0.5);
    p5.rectMode(p5.CENTER);
    p5.strokeWeight(params.lineWidth);

    for (let i = 0; i < params.times; i++) {
      c = p5.map(i, 0, params.times - 1, 1, params.minDim);
      p5.stroke(fg[i]);
      drawShape(p5, params.sides, c * dim);
      p5.rotate(params.angle);
    }

  };
}, settings).then(manager => sketchManager = manager);
