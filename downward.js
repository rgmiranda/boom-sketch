const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'downward'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawSteps = (context, width, height) => {
  const numSteps = 8;
  const pad = width / numSteps;
  context.save();
  context.translate(width * 0.5, height * 0.5);
  for (let i = 1; i <= numSteps; i++) {
    const size = i * pad;
    context.beginPath();
    context.rect(-width * 0.6, -height * 0.6, width * 1.2, height * 1.2);
    context.rect(-0.5 * size, -0.5 * size, size, size);
    context.fillStyle = 'white'
    context.shadowColor = 'black';
    context.shadowOffsetY = 25;
    context.shadowBlur = 150;
    context.fill('evenodd');
  }
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawSteps(context, width, height);
  };
};

canvasSketch(sketch, settings);
