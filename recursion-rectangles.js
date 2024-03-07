const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const risoColors = require('riso-colors');
const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `recursion-rects-${seed}`
};
const maxDepth = 4;

const colors = Array(5).fill(0).map(() => random.pick(risoColors).hex);

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
  const ratio = random.range(0.2, 0.8);
  context.beginPath();
  context.rect(x, y, w, h);
  context.strokeStyle = 'black';
  context.lineWidth = 4;
  context.fillStyle = random.pick(colors);
  context.fill();
  context.stroke();
  
  if ( depth >= maxDepth ) {
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
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    divide(0, 0, width, height, 0, 0, context);
  };
};

canvasSketch(sketch, settings);
