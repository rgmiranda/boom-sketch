const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'conway',
};

const pixelSize = 10;
const timespan = 0.05;
let clicked = false;

/**
 * 
 * @param { HTMLCanvasElement } canvas 
 * @param { boolean[] } cells 
 */
const addListeners = (canvas, cells, rows, cols) => {
  window.addEventListener('mousedown', () => { clicked = true; } );
  window.addEventListener('mouseup', () => clicked = false);
  window.addEventListener('mousemove', (ev) => {
    if ( clicked === false ) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const mx = Math.floor(((ev.clientX - rect.left) / rect.width) * cols);
    const my = Math.floor(((ev.clientY - rect.top) / rect.height) * rows);
    const i = my * cols + mx;

    if (i < cells.length && i >= 0) {
      cells[i] = true;
    }
  });
};

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { boolean[] } cells 
 * @param { number } rows 
 * @param { number } cols 
 */
const drawCells = (ctx, cells, rows, cols) => {
  cells.forEach((c, i) => {
    const x = i % cols * pixelSize;
    const y = Math.floor(i / cols) * pixelSize;
    ctx.fillStyle = c ? 'white' : 'black';
    ctx.fillRect(x, y, pixelSize, pixelSize);
  });
};

/**
 * 
 * @param { boolean[] } cells 
 * @param { number } rows 
 * @param { number } cols 
 */
const updateCells = (cells, cols, rows) => {
  const newCells = [ ...cells ];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let idx;
      let count = 0;
      for (let ii = Math.max(0, i - 1); ii < Math.min(rows, i + 2); ii++) {
        for (let jj = Math.max(0, j - 1); jj < Math.min(cols, j + 2); jj++) {
          idx = ii * cols + jj;
          count = count + (+cells[idx]);
        }
      }
      
      idx = i * cols + j;
      count -= (+cells[idx]);
      
      if (count === 3) {
        newCells[idx] = true;
      } else if (count != 2) {
        newCells[idx] = false;
      }
    }
  }
  newCells.forEach((v, i) => cells[i] = v);
};

const sketch = ({ width, height, canvas }) => {
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);
  const cells = Array(cols * rows).fill(false);
  addListeners(canvas, cells, rows, cols);
  let elapsedTime = 0;
  return ({ context, deltaTime }) => {
    if (elapsedTime > timespan && !clicked) {
      updateCells(cells, cols, rows);
      elapsedTime = 0;
    }
    drawCells(context, cells, rows, cols);
    elapsedTime += deltaTime;
  };
};

canvasSketch(sketch, settings);
