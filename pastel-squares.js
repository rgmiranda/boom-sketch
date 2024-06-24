const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `pastel-squares-${seed}`
};

const splits = 2;
const margin = 10;
const lineWidth = 4;

const colors = ['#ff99c8', '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9'];

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } x 
 * @param { number } y 
 * @param { number } size 
 * @param { number } depth 
 */
const drawSquare = (ctx, x, y, size, depth) => {
  if (depth >= colors.length) {
    return;
  }
  ctx.fillStyle = colors[depth];
  ctx.strokeStyle = 'black';
  ctx.lineWidth = lineWidth;
  const newSize = size / splits;
  for (let i = 0; i < splits; i++) {
    for (let j = 0; j < splits; j++) {
      ctx.beginPath();
      ctx.rect(x + j * newSize, y + i * newSize, newSize, newSize);
      ctx.fillStyle = colors[depth];
      ctx.fill();
      ctx.stroke();
      if (random.chance(0.5)) {
        drawSquare(ctx, x + j * newSize, y + i * newSize, newSize, depth + 1);
      }
    }
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawSquare(context, margin, margin, width - margin * 2, 0);
  };
};

canvasSketch(sketch, settings);
