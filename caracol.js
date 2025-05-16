const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'caracol'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } radius 
 * @param { number } offset 
 */
const drawCircle = (context, radius, offset) => {
  context.beginPath();
  context.moveTo(radius + offset, 0);
  context.arcTo(radius + offset, radius, offset, radius, radius);
  context.lineTo(0, radius + offset);
  context.arcTo(-radius, radius + offset, -radius, offset, radius);
  context.lineTo(-radius - offset, 0);
  context.arcTo(-radius - offset, -radius, -offset, -radius, radius);
  context.lineTo(0, -radius - offset);
  context.arcTo(radius, -radius - offset, radius, -offset, radius);
  context.closePath();
  context.stroke();
};

const sketch = () => {
  return ({ context, width, height }) => {
    const circles = 16;
    const radius = width * 0.4;
    const offset = radius * 0.2;
    const rPad = radius / circles;
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.lineWidth = rPad * 0.5;
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);

    for (let i = circles; i > 2; i--) {
      drawCircle(context, rPad * i, offset);
    }

  };
};

canvasSketch(sketch, settings);
