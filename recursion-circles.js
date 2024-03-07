const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `recursion-circles`
};
const maxDepth = 8;

/**
 * 
 * @param { number } cx 
 * @param { number } cy 
 * @param { number } size 
 * @param { number } depth 
 * @param { CanvasRenderingContext2D } ctx 
 * @returns 
 */
const drawCircle = (cx, cy, size, depth, ctx) => {
  if (depth >= maxDepth) {
    return;
  }
  drawCircle(cx - size * 0.25, cy - size * 0.25, size * 0.5, depth + 1, ctx);
  drawCircle(cx + size * 0.25, cy - size * 0.25, size * 0.5, depth + 1, ctx);
  drawCircle(cx - size * 0.25, cy + size * 0.25, size * 0.5, depth + 1, ctx);
  drawCircle(cx + size * 0.25, cy + size * 0.25, size * 0.5, depth + 1, ctx);

  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.25, 0, Math.PI * 2);
  ctx.fill();
  //ctx.stroke();
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawCircle(width * 0.5, height * 0.5, width, 0, context);
  };
};

canvasSketch(sketch, settings);
