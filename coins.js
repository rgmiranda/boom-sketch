const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'onepiece'
};

const numCoins = 4096 * 8;

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    let x, y;

    context.translate(width * 0.5, height * 0.5);
    context.shadowColor = 'black';
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 4;
    context.fillStyle = '#ffbf00';

    for (let i = 0; i < numCoins; i++) {
      x = random.gaussian(0, 1) * (width / 8);
      y = random.gaussian(0, 1) * (height / 8);
      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2);
      context.fill();
    }
  };
};

canvasSketch(sketch, settings);
