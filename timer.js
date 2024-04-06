const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `grid-${seed}`
};

const cellSize = 12.5;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } x 
 * @param { number } y 
 * @param { number } p 
 */
const drawCell = (ctx, x, y, p) => {
  ctx.save();

  const h = Math.SQRT1_2 * cellSize;
  ctx.translate(x + cellSize * 0.5, y + cellSize * 0.5);
  ctx.rotate(Math.PI * 0.25);
  for (let i = 0; i < 4; i++) {
    if (random.chance(p)) {
      ctx.rotate(Math.PI * 0.5);
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cellSize * 0.1, cellSize * 0.1);
    ctx.lineTo(cellSize * 0.1, h - cellSize * 0.1);
    ctx.lineTo(0, h);
    ctx.lineTo(-cellSize * 0.1, h - cellSize * 0.1);
    ctx.lineTo(-cellSize * 0.1, cellSize * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.rotate(Math.PI * 0.5);
    /*
    ctx.beginPath();
    ctx.arc(0, h * 0.5, cellSize * 0.15, 0, Math.PI * 2);
    ctx.rotate(Math.PI * 0.5);
    ctx.fill();
    */
  }

  ctx.restore();
};

const sketch = ({ height }) => {
  const colors = createColormap({
    colormap: 'portland',
    nshades: Math.ceil(height / cellSize),
  });
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    const md = height * height * 0.25;
    const cx = width * 0.5;
    const cy = height * 0.5;

    for (let y = 0; y < height; y += cellSize) {
      for (let x = 0; x < width; x += cellSize) {
        const d = (cx - x) * (cx - x) + (cy - y) * (cy - y);
        context.fillStyle = colors[Math.floor(y / cellSize)];
        drawCell(context, x, y, y / height);
      }
    }
  };
};

canvasSketch(sketch, settings);
