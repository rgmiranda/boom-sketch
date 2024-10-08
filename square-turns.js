const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `square-turns-${seed}`,
  animate: true,
};

const freq = 0.025;
const pixelSize = 60;
const amp = pixelSize * 0.5;
let colors;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } cols 
 * @param { number } rows 
 * @param { number } frame
 */
const drawTurns = (ctx, cols, rows, frame) => {
  const cj = cols * 0.5;
  const ci = rows * 0.5;
  for (let i = 0; i < rows; i++) {
    const y = i * pixelSize;
    for (let j = 0; j < cols; j++) {
      const x = j * pixelSize;
      const d = (cj - j) * (cj - j) + (ci - i) * (ci - i);
      const offset = Math.cos((d - frame * 2.5) * freq) * amp + amp;
      /*
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + pixelSize, y);
      ctx.lineTo(x + pixelSize, y + pixelSize);
      ctx.lineTo(x, y + pixelSize);
      ctx.closePath();
      ctx.strokeStyle = 'white';
      ctx.stroke();*/
      
      
      ctx.beginPath();
      ctx.moveTo(x + offset, y);
      ctx.lineTo(x + pixelSize, y + offset);
      ctx.lineTo(x + pixelSize - offset, y + pixelSize);
      ctx.lineTo(x, y + pixelSize - offset);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
    }
  }
};

const sketch = ({ width, height }) => {
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);
  colors = createColormap({
    colormap: 'cool',
    nshades: rows,
  })
  return ({ context, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.lineWidth = 5;
    drawTurns(context, cols, rows, frame);
  };
};

canvasSketch(sketch, settings);
