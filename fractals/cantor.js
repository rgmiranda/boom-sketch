const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'cantor'
};

const cols = 12;

/**
 * 
 * @param { number[] } set 
 */
const splitSet = (set) => {
  let a, b, d;
  let i = 0;
  while (i < set.length - 1) {
    a = set[i];
    b = set[i + 1];
    d = (b - a) * (1 / 3);
    a += d;
    b -= d;
    set.splice(i + 1, 0, a, b);
    i += 4;
  }
};

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number[] } set 
 * @param { number } y 
 * @param { number } colHeight 
 */
const drawSet = (ctx, set, y, colHeight) => {
  for (let i = 0; i < set.length - 1; i += 2) {
    ctx.fillStyle = '#66FF66';
    ctx.fillRect(set[i], y, set[i + 1] - set[i], colHeight);
  }
};

const sketch = () => {  
  return ({ context, width, height }) => {
    const colHeight = height / cols;
    const set = [0, width];
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    for (let i = 0; i < cols; i++) {
      drawSet(context, set, i * colHeight, colHeight);
      splitSet(set);
    }
  };
};

canvasSketch(sketch, settings);
