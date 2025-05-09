const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'floor',
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } splits 
 */
const drawFloor = (context, width, height, splits) => {
  const ph = height / splits;
  const pw = width / splits;

  context.globalCompositeOperation = 'xor';
  context.fillStyle = 'black';

  for (let i = 0; i < splits; i++) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo((i + 1) * pw, 0);
    context.lineTo(0, height);
    context.closePath();
    context.fill();
  }
  for (let i = 0; i < splits; i++) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.lineTo((i + 1) * pw, height);
    context.lineTo(0, height);
    context.closePath();
    context.fill();
  }
  for (let i = 0; i < splits; i++) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.lineTo(width, (i + 1) * ph);
    context.closePath();
    context.fill();
  }

  for (let i = 0; i < splits; i++) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.lineTo(width, height);
    context.lineTo(0, (i + 1) * ph);
    context.closePath();
    context.fill();
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    drawFloor(context, width, height, 7);
    
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
