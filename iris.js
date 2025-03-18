const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'iris'
};

const colors = [
  '#007bff',
  '#00a7ef',
  '#00d3e0',
  '#00ffd0',
];

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawEye = (context, width, height) => {
  const strokes = 4096 * 3;
  const innerRadius = width * 0.15;
  const outerRadius = width * 0.38;

  context.save();
  context.translate(width * 0.5, height * 0.5);
  for (let i = 0; i < strokes; i++) {
    const offset = random.gaussian(0, 60);
    context.strokeStyle = random.pick(colors);
    context.lineWidth = 0.25;
    context.beginPath();
    context.moveTo(0, innerRadius + offset * 0.25);
    context.lineTo(0, outerRadius + offset);
    context.stroke();
    context.rotate(random.range(0, Math.PI * 2));
  }
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawEye(context, width, height);
  };
};

canvasSketch(sketch, settings);
