const canvasSketch = require('canvas-sketch');
const { Vector } = require('./calc');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  fps: 12,
  name: 'dragon'
};

const maxFolds = 15;
const foldSize = 4;

const colors = createColormap({
  colormap: 'rainbow-soft',
  nshades: maxFolds,
}).reverse();

let sketchManager;

/**
 * 
 * @param { number } numFolds 
 * @returns { number[] }
 */
const foldDragon = (numFolds) => {
  let folds = [];

  for (let i = 0; i < numFolds; i++) {
    if (folds.length === 0) {
      folds.push(-1);
      continue;
    }
    const newPart = folds.map(e => e * -1).reverse();
    folds.push(-1);
    folds = folds.concat(newPart);
  }
  return folds;
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } folds 
 */
const drawDragon = (context, width, height, folds) => {
  const dir = new Vector(0, 1);
  let cx, cy;
  let px = width * 0.75;
  let py = height * 0.35;
  let ci = 0, nci;
  context.beginPath();
  context.moveTo(px, py);
  for (let i = 0; i < folds.length; i++) {
    cx = px + dir.x * foldSize;
    cy = py + dir.y * foldSize;
    context.lineTo(cx, cy);
    nci = Math.floor(Math.log2(i));
    if ( nci !== ci ) {
      context.strokeStyle = colors[ci];
      context.stroke();
      ci = nci;
      context.beginPath();
      context.moveTo(cx, cy);
    }
    dir.transpose();
    if (dir.y == 0) {
      dir.mult(folds[i] * -1);
    } else {
      dir.mult(folds[i]);
    }
    px = cx;
    py = cy;
  }
  
  cx = px + dir.x * foldSize;
  cy = py + dir.y * foldSize;
  context.lineTo(cx, cy);
  context.strokeStyle = colors[ci];
  context.stroke();
};


const addListeners = () => {
  window.addEventListener('click', () => {
    if (!sketchManager) {
      return;
    }
    if (sketchManager.props.playing) {
      sketchManager.pause();
    } else {
      sketchManager.play();
    }
  });
};


const sketch = () => {
  let numFolds = 0;
  let folds;
  let totalDelta = Number.MAX_VALUE;
  let timespan = 0.01;
  let timespanRatio = 1.25;
  let step = 1;
  let stopped = false;
  addListeners();
  return ({ context, width, height, deltaTime }) => {
    if (totalDelta > timespan && !stopped) {
      numFolds += step;
      totalDelta = 0;
      folds = foldDragon(numFolds);
      timespan *= timespanRatio;
      if (numFolds >= maxFolds) {
        stopped = true;
        step = -1;
        timespanRatio = 1 / timespanRatio;
        setTimeout(() => stopped = false, 3000);
      }
      if (numFolds <= 0) {
        stopped = true;
        sketchManager.pause();
      }
    } else {
      totalDelta += deltaTime;
    }
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    if (numFolds === 0) {
      return;
    }
    drawDragon(context, width, height, folds);
  };
};

canvasSketch(sketch, settings).then(manager => {
  sketchManager = manager;
  sketchManager.pause();
});;
