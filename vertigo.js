const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();
const numSquares = 32;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `vertigo-${seed}`
};

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } x 
 * @param { number } y 
 * @param { number } size 
 * @param { number } cx 
 * @param { number } cy 
 */
const drawSquare = (ctx, x, y, size, cx, cy) => {

  const dist = Math.sqrt((cx - x) * (cx - x) + (cy - y) * (cy -  y));
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, dist);
  gradient.addColorStop(0, 'black');
  gradient.addColorStop(1, 'white');
  ctx.fillStyle = gradient;

  if (cx < x) {
    if (cy < y) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + size);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if ((y + size) < cy) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x, y + size);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else if ((x + size) < cx) {
    if (cy < y) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size, y + size);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if ((y + size) < cy) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x, y + size);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x + size, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x + size, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else {
    if (cy < y) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if ((y + size) < cy) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x, y + size);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.beginPath();
  ctx.rect(x, y, size, size);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.stroke();
};

const sketch = ({ width, height }) => {
  random.setSeed(seed);

  const cx = width * 0.5;
  const cy = height * 0.65;
  const squares = Array(numSquares).fill(0).map(() => {
    const size = random.range(50, 150);
    let x, y;
    do {
      x = random.range(0, width - size);
      y = random.range(0, height - size);
    } while (x < cx && cx < (x + size) && y < cy && cy < (y + size));
    return { x, y, size };
  });
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'white';
    squares.forEach(({x, y, size}) => drawSquare(context, x, y, size, cx, cy));
  };
};

canvasSketch(sketch, settings);
