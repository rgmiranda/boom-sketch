const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const squares = 36;
const lineWidth = 10;
const angle = Math.PI / 4;
const colormap = 'portland';
const ratio = 0.95;

const colors = createColormap({
  colormap,
  nshades: squares,
});

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `square-stars-${squares}-${colormap}`
};

const sketch = () => {
  return ({ context, width, height }) => {
    let squareSizes = width * ratio;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    context.strokeStyle = 'black';

    context.shadowOffsetX = 0;
    context.shadowBlur = 15;
    context.lineWidth = lineWidth;

    for (let i = 0; i < squares; i++) {
      context.rotate(angle);
      context.shadowColor = colors[i];
      context.beginPath();
      context.rect(-squareSizes * 0.5, - squareSizes * 0.5, squareSizes, squareSizes);
      context.fill();
      context.fill();
      context.fill();
      squareSizes *= ratio;
    }
  };
};

canvasSketch(sketch, settings);
