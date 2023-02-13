const canvasSketch = require('canvas-sketch');

const cvWidth = cvHeight = 1080;
const radius = cvWidth * 0.4;
const offset = 20;

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    const cx = width * 0.5;
    const cy = height * 0.5;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();
    context.filter = 'blur(5px)';
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.arc(cx + offset, cy + offset, radius - offset * 0.5, 0, Math.PI * 2);
    context.fillStyle = 'black';
    context.fill();
    context.restore();
  };
};

canvasSketch(sketch, settings);
