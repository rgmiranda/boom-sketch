const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `recursion-squares`
};
const maxDepth = 6;

/**
 * 
 * @param { number } cx 
 * @param { number } cy 
 * @param { number } size 
 * @param { number } depth 
 * @param { CanvasRenderingContext2D } ctx 
 * @returns 
 */
const drawSquare = (cx, cy, size, depth, ctx) => {
  if (depth >= maxDepth) {
    return;
  }
  drawSquare(cx - size * 0.25, cy - size * 0.25, size * 0.5, depth + 1, ctx);
  drawSquare(cx + size * 0.25, cy - size * 0.25, size * 0.5, depth + 1, ctx);
  drawSquare(cx - size * 0.25, cy + size * 0.25, size * 0.5, depth + 1, ctx);
  drawSquare(cx + size * 0.25, cy + size * 0.25, size * 0.5, depth + 1, ctx);

  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.rect(cx - size * 0.25, cy - size * 0.25, size * 0.5, size * 0.5);
  ctx.fill();
  //ctx.stroke();
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawSquare(width * 0.5, height * 0.5, width, 0, context);
  };
};

canvasSketch(sketch, settings);
