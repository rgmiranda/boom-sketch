const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'shriek',
};


/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawShriek = (context, width, height) => {
  const strokes = 512 + 256;
  const angle = 2 * Math.PI / strokes;
  const outerRadius = width * 0.25;
  const innerRadius = width * 0.1;
  context.save();

  context.translate(width * 0.5, height * 0.5);
  let offset = Math.random() * width * 0.2;

  context.beginPath();
  for (let i = 0; i < strokes; i++) {
    if (i === 0) {
      context.moveTo(outerRadius + offset, 0);
    } else {
      context.lineTo(outerRadius + offset, 0);
    }
    context.arc(0, 0, outerRadius + offset, 0, angle);
    context.rotate(angle);
    offset = Math.random() * width * 0.2;
  }
  context.closePath();
  context.fillStyle = 'white';
  context.fill();
  
  offset = Math.random() * width * 0.15;
  context.beginPath();
  for (let i = 0; i < strokes; i++) {
    if (i === 0) {
      context.moveTo(innerRadius + offset, 0);
    } else {
      context.lineTo(innerRadius + offset, 0);
    }
    context.arc(0, 0, innerRadius + offset, 0, angle);
    context.rotate(angle);
    offset = Math.random() * width * 0.15;
  }
  context.closePath();
  context.fillStyle = 'black';
  context.fill();

  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawShriek(context, width, height);
  };
};

canvasSketch(sketch, settings);
