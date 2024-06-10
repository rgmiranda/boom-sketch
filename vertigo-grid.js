const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `vertigo-grid-${seed}`
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
const drawFall = (ctx, x, y, size, cx, cy) => {

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
  const cellSize = 120;
  
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  
  const squares = [];
  
  for (let i = -1; i < rows + 1; i++) {
    for (let j = -1; j < cols + 1; j++) {
      if (random.chance(0.5)) {
        continue;
      }
      const pad = random.range(0.1, 0.4) * cellSize;
      const y = i * cellSize + pad;
      const x = j * cellSize + pad;
      const size = cellSize - 2 * pad;
      squares.push({ x, y, size});
    }
  }

  squares.sort((sa, sb) => {
    const da = Math.sqrt((sa.x - cx) * (sa.x - cx) + (sa.y - cy) * (sa.y - cy));
    const db = Math.sqrt((sb.x - cx) * (sb.x - cx) + (sb.y - cy) * (sb.y - cy));
    return db - da;
  });

  return ({ context, width, height }) => {
    
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'white';
    squares.forEach(({x, y, size}) => drawFall(context, x, y, size, cx, cy));
    squares.forEach(({x, y, size}) => drawSquare(context, x, y, size, cx, cy));
  };
};

canvasSketch(sketch, settings);
