const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `shadow-rectangles-${seed}`
};
const maxDepth = 7;

const black = '#333';
const gray = '#777';
const lightgray = '#ddd';

/**
 * 
 * @param { number } x 
 * @param { number } y 
 * @param { number } w 
 * @param { number } h 
 * @param { number } depth 
 * @param { CanvasRenderingContext2D } context 
 */
const divide = (x, y, w, h, depth, context) => {
  
  if ( depth >= maxDepth ) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();

    if (w < h) {
      context.beginPath();
      context.moveTo(x + w, y);
      context.lineTo(x + w * 0.5, y + w * 0.5);
      context.lineTo(x + w * 0.5, y + h - w * 0.5);
      context.lineTo(x + w, y + h);
      context.closePath();
      context.fillStyle = gray;
      context.fill();
      context.stroke();
      
      context.beginPath();
      context.moveTo(x, y + h);
      context.lineTo(x + w * 0.5, y + h - w * 0.5);
      context.lineTo(x + w, y + h);
      context.closePath();
      context.fillStyle = black;
      context.fill();
      context.stroke();      
      
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + w * 0.5, y + w * 0.5);
      context.lineTo(x + w * 0.5, y + h - w * 0.5);
      context.lineTo(x, y + h);
      context.closePath();
      context.stroke();
      
      context.beginPath();
      context.moveTo(x + w * 0.25, y + w * 0.25);
      context.lineTo(x + w * 0.75, y + w * 0.25);
      context.lineTo(x + w * 0.75, y + h - w * 0.25);
      context.lineTo(x + w * 0.25, y + h - w * 0.25);
      context.closePath();
      context.fillStyle = lightgray;
      context.fill();
      context.stroke();
    } else {
      context.beginPath();
      context.moveTo(x + w, y);
      context.lineTo(x + w - h * 0.5, y + h * 0.5);
      context.lineTo(x + w, y + h);
      context.closePath();
      context.fillStyle = gray;
      context.fill();
      context.stroke();
      
      context.beginPath();
      context.moveTo(x, y + h);
      context.lineTo(x + h * 0.5, y + h * 0.5);
      context.lineTo(x + w - h * 0.5, y + h * 0.5);
      context.lineTo(x + w, y + h);
      context.closePath();
      context.fillStyle = black;
      context.fill();

      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + h * 0.5, y + h * 0.5);
      context.lineTo(x, y + h);
      context.closePath();
      context.stroke();

      context.beginPath();
      context.moveTo(x + h * 0.25, y + h * 0.25);
      context.lineTo(x + w - h * 0.25, y + h * 0.25);
      context.lineTo(x + w - h * 0.25, y + h * 0.75);
      context.lineTo(x + h * 0.25, y + h * 0.75);
      context.closePath();
      context.fillStyle = lightgray;
      context.fill();
      context.stroke();
    }

    return;
  }

  const ratio = random.range(0.25, 0.75);
  const dir = w < h ? 1 : 0;
  
  if ( dir === 0 ) {
    divide(x, y, w * ratio, h, depth + 1, context);
    divide(x + w * ratio, y, w * (1- ratio), h, depth + 1, context);
  } else {
    divide(x, y, w, h * ratio, depth + 1, context);
    divide(x, y + h * ratio, w, h * (1 - ratio), depth + 1, context);
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    divide(0, 0, width, height, 0, context);
  };
};

canvasSketch(sketch, settings);
