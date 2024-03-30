const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'grid-wave',
  animate: true,
};

const freq = 0.00001;
const cellSize = 20;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } x 
 * @param { number } y 
 * @param { number } size 
 * @param { number } offsetRatio 
 */
const drawCell = (ctx, x, y, size, offsetRatio) => {
  ctx.beginPath();
  ctx.moveTo(x + offsetRatio * 0.5 * size, y + offsetRatio * 0.5 * size);
  ctx.lineTo(x + size - offsetRatio * 0.5 * size, y + offsetRatio * 0.5 * size);
  ctx.lineTo(x + size - offsetRatio * 0.5 * size, y + size - offsetRatio * 0.5 * size);
  ctx.lineTo(x + offsetRatio * 0.5 * size, y + size - offsetRatio * 0.5 * size);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } width 
 * @param { number } height 
 * @param { number } size 
 * @param { number } frame 
 */
const drawGrid = (ctx, width, height, size, frame) => {
  const cols = Math.ceil(width / size);
  const rows = Math.ceil(height / size);
  const cx = width * 0.5;
  const cy = height * 0.5;

  for (let i = 0; i < rows; i  ++) {
    const y = i  * size;
    for (let j = 0; j < cols; j++) {
      const x = j * size;
      const d = (cx - x) * (cx - x) + (cy - y) * (cy - y);
      const offsetRatio = Math.cos(Math.PI + (d - frame * 10000) * freq) * 0.5 + 0.5;
      drawCell(ctx, x, y, size, offsetRatio);
    }
  }
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'black';

    drawGrid(context, width, height, cellSize, frame);
  };
};

canvasSketch(sketch, settings);
