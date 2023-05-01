const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'spiral-worm'
};
const params = {
  startAngle: 0,
  endAngle: Math.PI * 2,
  steps: 720,
  amplitude: 400,
  xk: 3,
  yk: 2,
}

const sketch = ({ width, height, context }) => {
  const angleStep = (params.endAngle - params.startAngle) / params.steps;
  let angle;
  let x, y, i;
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  i = 0;
  return ({ context, width, height }) => {
    if (i >= params.steps) {
      return;
    }
    context.translate(width * 0.5, height * 0.5);
    context.strokeStyle = 'white';
    angle = angleStep * i;
    x = Math.cos(params.xk * angle) * params.amplitude;
    y = Math.sin(params.yk * angle) * params.amplitude;
    context.beginPath();
    context.arc(x, y, 80, 0, Math.PI * 2);
    context.stroke();
    i++;

  };
};

canvasSketch(sketch, settings);
