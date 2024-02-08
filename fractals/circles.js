const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'circles-fractals',
};

const maxDepth = 9;
const prop = 2 / (1 + Math.sqrt(5));

const colors = createColormap({
  nshades: maxDepth * 2 - 1,
  colormap: 'portland'
});

/**
 * 
 * @param { CanvasRenderingContext2D } context
 * @param { number } cx
 * @param { number } cy
 * @param { number } radius
 * @param { number } depth
 * @param { number } dir
 * @returns 
 */
const drawCircles = (context, cx, cy, radius, depth, dir) => {
  if ( depth >= maxDepth ) {
    return;
  }
  context.strokeStyle = 'white';
  
  /*
  if (depth === maxDepth - 1) {
    context.arc(cx, cy, radius, 0, Math.PI * 2);
  } else if ((depth % 2) === 0) {
    context.arc(cx, cy, radius, 0, Math.PI);
  } else {
    context.arc(cx, cy, radius, Math.PI, Math.PI * 2);
  }*/
  if (depth === 0) {
    context.beginPath();
    context.arc(cx, cy, radius, Math.PI, Math.PI * 2);
    context.closePath();
    context.fillStyle = colors[0];
    context.fill();
    
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI);
    context.fillStyle = colors[colors.length - 1];
    context.closePath();
    context.fill();
  } else if (depth === maxDepth - 1) {
    context.beginPath();
    context.arc(cx, cy, radius, Math.PI, Math.PI * 2);
    context.closePath();
    context.fillStyle = colors[depth];
    context.fill();
    
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI);
    context.closePath();
    context.fill();
  } else if (dir > 0) {
    context.beginPath();
    context.arc(cx, cy, radius, Math.PI, Math.PI * 2);
    context.closePath();
    context.fillStyle = colors[colors.length - 1 - depth];
    context.fill();
  } else {
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI);
    context.closePath();
    context.fillStyle = colors[depth];
    context.fill();
  }


  drawCircles(context, cx - radius * (1 - prop), cy, radius * prop, depth + 1, 1);
  drawCircles(context, cx + radius * prop, cy, radius * (1 - prop), depth + 1, -1);
};

const sketch = ({ width }) => {
  const radius = width * 0.48;

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    drawCircles(context, width * 0.5, height * 0.5, radius, 0, 1);
  };
};

canvasSketch(sketch, settings);
