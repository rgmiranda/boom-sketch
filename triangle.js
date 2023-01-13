const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

function drawSkewedRect(context, w = 600, h = 200, angle = Math.PI * 0.25) {
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save();
  context.translate( rx * -0.5, (ry + h) * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();
  context.stroke();

  context.restore();
}

let angle = 0;
const angleStep = 0.01;

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    angle += angleStep;

    context.translate(width * 0.5, height * 0.5);

    context.strokeStyle = 'blue';
    drawSkewedRect(context, 600, 100, angle);

  };
};

canvasSketch(sketch, settings);
