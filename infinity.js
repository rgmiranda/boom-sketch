const canvasSketch = require('canvas-sketch');

const cvWidth = cvHeight = 1080;
const lineWidth = 20;
const circles = 8;
const maxRadius = cvHeight * 0.28
const radiusStep = maxRadius / circles;

const settings = {
  dimensions: [cvWidth, cvHeight]
};

const sketch = ({ width, height }) => {
  const c1 = {
    x: width * 0.5,
    y: (height  - maxRadius - radiusStep) * 0.5
  };
  const c2 = {
    x: width * 0.5,
    y: (height + maxRadius + radiusStep) * 0.5
  }
  return ({ context, width, height }) => {
    context.fillStyle = '#F2EECB';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = '#1E293B';
    context.lineWidth = lineWidth;

    for (let i = 0; i < circles; i++) {
      context.beginPath();
      context.arc(c1.x, c1.y, maxRadius - i * radiusStep, 0, Math.PI * 2);
      context.stroke();

      context.beginPath();
      context.arc(c2.x, c2.y, maxRadius - i * radiusStep, 0, Math.PI * 2);
      context.stroke();
    }

    for (let i = 0; i < circles; i++) {
      context.beginPath();
      context.moveTo(c1.x, c1.y);
      context.arc(c1.x, c1.y, maxRadius - i * radiusStep, Math.PI, Math.PI * 0.5);
      context.fill();

      context.beginPath();
      context.arc(c1.x, c1.y, maxRadius - i * radiusStep, Math.PI, Math.PI * 0.5);
      context.stroke();
      
      context.beginPath();
      context.moveTo(c2.x, c2.y);
      context.arc(c2.x, c2.y, maxRadius - i * radiusStep, 0, Math.PI * 1.5);
      context.fill();
  
      context.beginPath();
      context.arc(c2.x, c2.y, maxRadius - i * radiusStep, 0, Math.PI * 1.5);
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
