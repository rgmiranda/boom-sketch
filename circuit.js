const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `circuit-${seed}`
};
const pixelSize = 48;
const subpixelSize = pixelSize / 3;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } x 
 * @param { number } y 
 */
const drawPixel = (ctx, x, y) => {
  ctx.beginPath();
  ctx.rect(x + subpixelSize, y + subpixelSize, subpixelSize, subpixelSize);
  ctx.stroke();
  ctx.fill();
  let ph = 0.5, pv = 0.5;

  if (random.chance(ph)) {
    ctx.beginPath();
    ctx.rect(x + subpixelSize, y, subpixelSize, subpixelSize);
    ctx.stroke();
    ctx.fill();
    ph *= 2;
    pv *= 0.5;
  }
  if (random.chance(pv)) {
    ctx.beginPath();
    ctx.rect(x, y + subpixelSize, subpixelSize, subpixelSize);
    ctx.stroke();
    ctx.fill();
    pv *= 2;
    ph *= 0.5;
  }
  if (random.chance(pv)) {
    ctx.beginPath();
    ctx.rect(x + 2 * subpixelSize, y + subpixelSize, subpixelSize, subpixelSize);
    ctx.stroke();
    ctx.fill();
  }
  if (random.chance(ph)) {
    ctx.beginPath();
    ctx.rect(x + subpixelSize, y + 2 * subpixelSize, subpixelSize, subpixelSize);
    ctx.stroke();
    ctx.fill();
  }
};

const sketch = ({ width, height }) => {
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);
  return ({ context }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'white';
    context.strokeStyle = 'white';

    for (let i = 0; i < rows; i++) {
      const y = i * pixelSize;
      for (let j = 0; j < cols; j++) {
        const x = j * pixelSize;
        drawPixel(context, x, y);
      }
    }
  };
};

canvasSketch(sketch, settings);
