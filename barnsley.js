const canvasSketch = require('canvas-sketch');
const { Pane } = require('tweakpane');

let sketchManager;

const paneParams = {
  runs: 10000
}
const pane = new Pane();
pane.addInput(paneParams, 'runs', {
  min: 1000,
  max: 100000,
  step: 1000
}).on('change', () => { 
  if (sketchManager) {
    sketchManager.render();
  }
});
const settings = {
  dimensions: [ 1080, 1080 ],
  name: `barnsley`,
};
const amp = 100;
const transforms = [
  {
    p: 0.01,
    t: [0, 0, 0, 0.16, 0, 0]
  },
  {
    p: 0.86,
    t: [0.85, 0.04, -0.04, 0.85, 0, 1.60 * amp]
  },
  {
    p: 0.93,
    t: [0.20, -0.26, 0.23, 0.22, 0, 1.60 * amp]
  },
  {
    p: 1,
    t: [-0.15, 0.28, 0.26, 0.24, 0, 0.44 * amp]
  }
];

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 */
const drawFern = (ctx) => {
  let rnd;
  let transformation
  ctx.fillStyle = 'green';
  let x = 0, y = 0, nx, ny;
  for (let i = 0; i < paneParams.runs; i++) {
    rnd = Math.random();
    transformation = transforms.find(tr => rnd < tr.p);
    const [a, b, c, d, e, f] = transformation.t;

    nx = a * x + b * y + e;
    ny = c * x + d * y + f;

    ctx.beginPath();
    ctx.arc(nx, ny, 1, 0, Math.PI * 2);
    ctx.fill();

    x = nx;
    y = ny;
  }
};

const sketch = () => {
  return ({ context, width, height }) => {

    context.save();

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    
    context.translate(width * 0.5, height);
    context.scale(1, -1);
    drawFern(context);

    context.restore();
  };
};

canvasSketch(sketch, settings).then(manager => sketchManager = manager);
