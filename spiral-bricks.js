const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const risoColors = require('riso-colors');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `recursion-spiral-bricks-${seed}`
};
const maxDepth = 6;

const colors = [
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
]

/**
 * 
 * @param { number } x 
 * @param { number } y 
 * @param { number } w 
 * @param { number } h 
 * @param { number } dir 
 * @param { number } depth 
 * @param { CanvasRenderingContext2D } context 
 */
const divide = (x, y, w, h, dir, depth, context) => {
  const ratio = random.range(0.25, 0.75);
  const rad = random.range(5, 10);
  let pad = rad;
  
  if ( depth >= maxDepth ) {
    context.beginPath();
    context.roundRect(x, y, w, h, rad);
    context.strokeStyle = 'black';
    context.fillStyle = 'white';
    context.lineWidth = 8;
    context.fill();
    context.stroke();
    
    const spiralOpts = [
      [x + pad, y, [[0, 1], [1, 0], [0, -1], [-1, 0]]],
      [x, y + pad, [[1, 0], [0, 1], [-1, 0], [0, -1]]],
      [x, y + h - pad, [[1, 0], [0, -1], [-1, 0], [0, 1]]],
      [x + pad, y + h, [[0, -1], [1, 0], [0, 1], [-1, 0]]],
      [x + w, y + h - pad, [[-1, 0], [0, -1], [1, 0], [0, 1]]],
      [x + w - pad, y + h, [[0, -1], [-1, 0], [0, 1], [1, 0]]],
      [x + w - pad, y, [[0, 1], [-1, 0], [0, -1], [1, 0]]],
      [x + w, y + pad, [[-1, 0], [0, 1], [1, 0], [0, -1]]],
    ];
    let [sx, sy, sd] = random.pick(spiralOpts);
    let idx = 0;
    const lw = 4;
    context.lineCap = 'round';
    while (pad < w * 0.95 && pad < h * 0.95) {
      if ((idx % 4) === 1 || (idx  % 4) === 3 ) {
        pad += rad;
      }
      context.beginPath();
      context.moveTo(sx, sy);
      sx += sd[idx % sd.length][0] * (w - pad);
      sy += sd[idx % sd.length][1] * (h - pad);
      context.lineWidth = lw * (Math.min(h, w) - pad) / Math.min(h, w);
      context.lineTo(sx, sy);
      context.stroke();
      idx++;
    }
    
    return;
  }
  
  if ( dir === 0 ) {
    divide(x, y, w * ratio, h, 1, depth + 1, context);
    divide(x + w * ratio, y, w * (1- ratio), h, 1, depth + 1, context);
  } else {
    divide(x, y, w, h * ratio, 0, depth + 1, context);
    divide(x, y + h * ratio, w, h * (1 - ratio), 0, depth + 1, context);
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    divide(0, 0, width, height, Math.round(random.value()), 0, context);
  };
};

canvasSketch(sketch, settings);
