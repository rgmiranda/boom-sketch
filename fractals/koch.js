const canvasSketch = require('canvas-sketch');
const { Vector } = require('../calc');
const createColormap = require('colormap');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'koch',
};

const maxDepth = 5;
const timespan = 4;
let stopped = true;

const bgColors = createColormap({
  nshades: 24,
  colormap: 'inferno',
});

/**
 * 
 * @param { Vector[] } path 
 * @param { number } depth 
 * @param { number } proportion 
 */
const updatePath = (path, proportion) => {
  const a = proportion * 2 * Math.PI / 6;
  let sub, nv, d;
  let i = 2;
  while (i < path.length - 1) {
    nv = path[i - 1].copy();
    sub = path[i + 1].copy();
    sub.sub(path[i - 1]);
    d = sub.mag * 0.5;
    if (path[i - 1].x > path[i + 1].x) {
      sub = Vector.fromAngle(sub.angle + a + (3 - 2 * proportion) * Math.PI / 3 );
    } else {
      sub = Vector.fromAngle(sub.angle - a);
    }
    sub.mult(d / Math.cos(a));
    sub.add(path[i - 1]);
    
    path.splice(i, 1, sub);

    i += 4;
  }
};

/**
 * 
 * @param { Vector[] } path 
 */
const insertPath = (path) => {
  let sub, a, d, va, vb, vc;
  let i = 0;
  while ( i < path.length - 1 ) {
    sub = path[i + 1].copy();
    sub.sub(path[i]);
    sub.mult(1/3);
    d = sub.mag;
    a = sub.angle;
    va = path[i].copy();
    va.add(sub);
    
    vc = path[i].copy();
    vc.add(sub);
    vc.add(sub);
    
    vb = path[i].copy();
    vb.add(sub);
    sub.mult(0.5);
    vb.add(sub);

    path.splice(i + 1, 0, va, vb, vc);

    i += 4;
  }
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { Vector[] } path 
 * @param { number } width 
 * @param { number } height
 */
const drawPath = (context, path, width, height) => {
  context.beginPath();
  context.moveTo(0, path[0].y);
  path.forEach(p => {
    context.lineTo(p.x, p.y);
  });
  context.lineTo(width, path[path.length - 1].y);
  context.lineTo(width, height);
  context.lineTo(0, height);
  context.closePath();
  context.fillStyle = 'black';
  context.fill();
};

const addListeners = () => {
  window.addEventListener('keyup', (ev) => {
    if (ev.code === 'KeyP') {
      stopped = !stopped;
    }
  });
};

const sketch = ({ width, height, context }) => {
  const path = [
    new Vector(0, height * 0.6),
    new Vector(width, height * 0.6),
  ];
  let elapsedTime = timespan + 1;
  let depth = 0;
  const gradient = context.createLinearGradient(0, 0, 9, height * 0.6);
  bgColors.forEach((c, i ) => gradient.addColorStop(i / (bgColors.length - 1), c));
  addListeners();

  return ({ context, width, height, deltaTime }) => {

    if (!stopped) {
      if ( elapsedTime > timespan ) {
        if ( depth >= maxDepth ) {
          elapsedTime = timespan;
          updatePath(path, 1);
          stopped = true;
        } else {
          elapsedTime = 0;
          depth++;
          insertPath(path);
        }
      } else {
        const prop = eases.sineInOut(elapsedTime / timespan);
        updatePath(path, prop);
      }
    }

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    drawPath(context, path, width, height);
    console.log(path);

    elapsedTime += deltaTime;
  };
};

canvasSketch(sketch, settings);
