const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');

const maxRadius = 500;
const circles = 32;
const radiusPadding = maxRadius / circles;
const bg = 'black';
const fg = 'white';

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'plate'
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5)
    let currRadius, offset;

    for (let i = 0; i < circles; i++) {
      currRadius = (circles - i) * radiusPadding;
      offset = Math.cos(math.mapRange(i, 0, circles - 1, 0, Math.PI * 2));

      context.fillStyle = fg;
      context.beginPath();
      context.arc(0, 0, currRadius, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.fillStyle = bg;
      context.arc(radiusPadding * 0.5 * offset, 0, currRadius -  0.5 * radiusPadding, 0, Math.PI * 2);
      context.fill();
    }

  };
};

canvasSketch(sketch, settings);
