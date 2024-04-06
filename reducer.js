const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const maxDepth = 57;
const numSides = 7;
const anglePad = 2 * Math.PI / (numSides * 7);

const colors = createColormap({
  colormap: 'copper',
  nshades: maxDepth,
})

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } radius 
 * @param { number } sides 
 * @param { number } depth 
 */
const drawPolygon = (ctx, radius, sides, depth) => {

  if (depth >= maxDepth) {
    return;
  }

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  const angle = Math.PI * 2 / sides;
  for (let i = 0; i < sides; i++) {
    ctx.rotate(angle);
    ctx.lineTo(0, -radius);
  }
  ctx. closePath();
  ctx.lineWidth = math.mapRange(depth, 0, maxDepth, 5, 1, true);
  ctx.strokeStyle = colors[depth];
  ctx.stroke();
  ctx.restore();
  
  const theta = angle * 0.5;
  const iota = theta - anglePad;
  const apothem = radius * Math.cos(theta);
  const nr = apothem / Math.cos(iota);
  
  ctx.save();
  ctx.rotate(anglePad);
  drawPolygon(ctx, nr, sides, depth + 1);
  ctx.restore();

}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, height * 0.5);
    context.rotate(frame * 0.05);

    drawPolygon(context, width * 0.7, numSides, 0);
  };
};

canvasSketch(sketch, settings);
