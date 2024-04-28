const canvasSketch = require('canvas-sketch');
const { loadImage, getImageBrightness } = require('./images');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'leloir'
};
const imageFile = 'leloir.jpg';
const cellSize = 10;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } x 
 * @param { number } y 
 * @param { number } size 
 */
const drawCell = (ctx, x, y, size) => {
  ctx.save();
  ctx.translate(x + cellSize * 0.5, y + cellSize * 0.5);
  const s = cellSize * (1 - size);
  ctx.rotate(Math.PI * 0.25);
  ctx.beginPath();
  ctx.moveTo(-s * 0.5, -s * 0.5);
  ctx.lineTo(s * 0.5, -s * 0.5);
  ctx.lineTo(s * 0.5, s * 0.5);
  ctx.lineTo(-s * 0.5, s * 0.5);
  ctx.closePath();
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.restore();
};

/*
const drawCell = (ctx, x, y, size) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + cellSize, y + (1 - size) * cellSize);
  ctx.lineTo(x + cellSize, y + cellSize);
  ctx.lineTo(x, y + cellSize - (1 - size) * cellSize);
  ctx.closePath();
  ctx.fillStyle = 'white';
  ctx.fill();
};
*/
const sketch = async ({ width, height }) => {
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const image = await loadImage(`images/${imageFile}`);
  const imageBrightness = getImageBrightness(image, cols, rows);

  return ({ context }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    imageBrightness.forEach((b, i) => {
      const x = (i % cols) * cellSize;
      const y = Math.floor(i / cols) * cellSize;
      drawCell(context, x, y, b / 255);
    });
  };
};

canvasSketch(sketch, settings);
