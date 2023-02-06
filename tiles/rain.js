const canvasSketch = require('canvas-sketch');
const { pick, rangeFloor } = require('canvas-sketch-util/random');


const rainDrops = 200;

const settings = {
  dimensions: [ 400, 400 ]
};

const rainDropsStyles = [
  {
    lineWidth: 3,
    color: '#CCC',
  },
  {
    lineWidth: 2,
    color: '#AAA',
  },
  {
    lineWidth: 1,
    color: '#999',
  }
];

const sketch = () => {
  return ({ context, width, height }) => {
    let dropStyle, x, y;
    const p = Math.random() + 1;
    for (let i = 0; i < rainDrops; i++) {
      dropStyle = pick(rainDropsStyles);
      context.lineWidth = dropStyle.lineWidth;
      context.strokeStyle = dropStyle.color;

      x = rangeFloor(0, width);
      y = rangeFloor(0, height);
      dx = Math.random() * 5 + 15;
      dy = p * dx;

      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + dx, y + dy);
      context.stroke();

      if (x + dx < width && y + dy < height) {
        continue;
      }

      if (x + dx > width) {
        x = x - width;
      }
      if (y + dy > height) {
        y = y - height;
      }
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + dx, y + dy);
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
