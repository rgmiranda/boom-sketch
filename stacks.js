const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'block-stacks'
};

const boxSize = 100;
const numPoints = 1000;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } x 
 * @param { number } y 
 * @param { number } size 
 */
const drawBox = (ctx, x, y, size) => {

  const r = 1 / 4;

  ctx.save();
  ctx.translate(x, y);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, size * r);
  ctx.lineTo(size * 0.5, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(size * 0.5, 0);
  ctx.lineTo(size, size * r);
  ctx.lineTo(size, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, size * r);
  ctx.lineTo(size * 0.5, size * 2 * r);
  ctx.lineTo(size * 0.5, size);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(size * 0.5, size);
  ctx.lineTo(size * 0.5, size * 2 * r);
  ctx.lineTo(size, size * r);
  ctx.lineTo(size, size);
  ctx.stroke();

  ctx.fillStyle = 'black';

  for (let i = 0; i < numPoints; i++) {
    if (Math.random() < 0.15) {
      const m = r / 0.5;
      const b = r * size;
      let px = Math.random() * size * 0.5;
      let py = (Math.random() * (1 - r) + r) * size;
      if (py < m * px + b) {
        py -= r * size;
        px += size * 0.5;
      }
      ctx.beginPath();
      ctx.arc(px, py, 1, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const m = -r / 0.5;
      const b =  3 * r * size;
      let px = Math.random() * size * 0.5 + size * 0.5;
      let py = (Math.random() * (1 - r) + r) * size;
      if (py < m * px + b) {
        py -= r * size;
        px -= size * 0.5;
      }
      ctx.beginPath();
      ctx.arc(px, py, 1, 0, Math.PI * 2);
      ctx.fill();
    } 
  }

  ctx.restore();
};

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } width 
 * @param { number } height 
 * @param { number } size 
 */
const drawStacks = (ctx, width, height, size) => {
  const rows = Math.ceil(height / size);
  const cols = Math.ceil(width / size);
  for (let i = 0; i < rows; i++) {
    const offset = (i % 2) === 0 ? size * 0.1 : size * 0.6;
    const y = i * size;
    for (let j = 0; j < cols + (i % 2); j++) {
      const x = j * size - offset;
      drawBox(ctx, x, y, size);
    }
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawStacks(context, width, height, boxSize);
  };
};

canvasSketch(sketch, settings);
