const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'agora'
};

const numCircles = 12;
const colors = createColormap({
  colormap: 'copper',
  nshades: numCircles * 1.5
}).slice(numCircles * 0.25);

const sketch = () => {
  return ({ context, width, height }) => {
    const minRadius = width * 0.1;
    const maxRadius = width * 0.45;
    const radiusDelta = (maxRadius - minRadius) / numCircles;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    let baseBrickWidth = 40;
    for (let i = 0; i < numCircles; i++) {
      context.rotate(random.value() * Math.PI)
      const radius = minRadius + radiusDelta * ( i + 1 );
      const rotations = Math.round(radius * 2 * Math.PI / baseBrickWidth);
      const angle = 2 * Math.PI / rotations;
      const brickWidth = radius * 2 * Math.PI / rotations;
      for (let j = 0; j < rotations; j++) {
        const shadowLength = random.range(4, 8);
        const color = random.pick(colors.slice(i, i + 6));
        context.save();
        context.translate(0, radius);
        context.rotate(random.range(-0.15, 0.15));
        context.fillStyle = color;
        context.shadowColor = '#000000BB';
        context.shadowOffsetX = -shadowLength;
        context.shadowOffsetY = shadowLength;
        context.fillRect(-brickWidth * 0.5, radiusDelta * 0.5, brickWidth, radiusDelta);
        context.restore();
        context.rotate(angle);
      }
      //baseBrickWidth += 1;
    }
  };
};

canvasSketch(sketch, settings);
