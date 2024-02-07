const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `cellular-1d-${Date.now()}`
};

const gridSize = 128;
const stepTime = 0.05;
let playing = false;
const history = [];

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number[] } cells 
 * @param { number[][] } row 
 */
const drawGrid = (context, width, height, cells, history) => {
  const ph = height / cells.length;
  const pw = width / cells.length;
  const y = ph * history.length;

  history.forEach((hcells, j) => {
    const hy = j * ph;
    hcells.forEach((e, i) => {
      if (e !== 1) {
        return;
      }
      const x = pw * i;
      context.fillStyle = '#66FF33';
      context.fillRect(x, hy, pw, ph);
    });
  });

  cells.forEach((e, i) => {
    if (e !== 1) {
      return;
    }
    const x = pw * i;
    context.fillStyle = '#66FF33';
    context.fillRect(x, y, pw, ph);
  });
};

/**
 * 
 * @param { number[] } cells 
 */
const nextGrid = (cells) => {
  const newCells = [];
  for (let i = 0; i < cells.length; i++) {
    const n = [cells[i]];
    if (i === 0) {
      n.unshift(0); // n.unshift(cells[cells.length - 1]);
    } else {
      n.unshift(cells[i - 1]);
    }
    if (i === cells.length - 1) {
      //pn.push(cells[0]);
      n.push(0);
    } else {
      n.push(cells[i + 1]);
    }
    newCells.push(calculateNew(n));
  }
  return newCells;
};

/**
 * 
 * @param { number[] } neighbors 
 */
const calculateNew = (neighbors) => {
  if (neighbors.length !== 3) {
    throw new Error('Bad length');
  }
  if (neighbors[0] === 1) {
    if (neighbors[1] === 1) {
      if (neighbors[2] === 1) {
        return 0;
      } else {
        return 1;
      }
    } else {
      if (neighbors[2] === 1) {
        return 0;
      } else {
        return 1;
      }
    }
  } else {
    if (neighbors[1] === 1) {
      if (neighbors[2] === 1) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (neighbors[2] === 1) {
        return 1;
      } else {
        return 0;
      }
    }
  }
};

/**
 * 
 * @param { HTMLCanvasElement } canvas 
 * @param { number[] } cells
 */
const addEventListeners = (canvas, cells) => {

  window.addEventListener('keyup', (ev) => {
    if (ev.code === 'KeyP') {
      playing = !playing;
    }
  });

  window.addEventListener('click', ev => {
    const rect = canvas.getBoundingClientRect();
    const mx = ev.clientX - rect.left;
    const i = Math.floor(cells.length * mx / rect.width);
    if (i < cells.length) {
      cells[i] = (cells[i] + 1) % 2;
    }
  });
};

const sketch = ({ canvas }) => {
  let cells = Array(gridSize).fill(0);
  
  cells[0] = 1;
  cells[Math.floor(gridSize * 0.125)] = 1;
  cells[Math.floor(gridSize * 0.25)] = 1;
  cells[Math.floor(gridSize * 0.375)] = 1;
  cells[Math.floor(gridSize * 0.5)] = 1;
  cells[Math.floor(gridSize * 0.625)] = 1;
  cells[Math.floor(gridSize * 0.75)] = 1;
  cells[Math.floor(gridSize * 0.875)] = 1;
  cells[gridSize - 1] = 1;
  
  /*cells[Math.floor(gridSize * 0.33)] = 1;
  cells[Math.floor(gridSize * 0.66)] = 1;*/
  //cells[Math.floor(gridSize * 0.375)] = 1;
  let totalDelta = 0;
  addEventListeners(canvas, cells);
  return ({ context, width, height, deltaTime }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawGrid(context, width, height, cells, history);

    if (!playing) {
      return;
    }

    totalDelta += deltaTime;
    if (totalDelta >= stepTime) {
      history.push(cells);
      if (history.length >= gridSize) {
        history.shift();
      }
      cells = nextGrid(cells);
      totalDelta = 0;
    }
  };
};

canvasSketch(sketch, settings);
