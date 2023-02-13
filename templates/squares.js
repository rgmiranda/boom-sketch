const canvasSketch = require('canvas-sketch');

const cvWidth = cvHeight = 1080;
const rows = 10;
const cols = 10;
const pw = cvWidth / cols;
const ph = cvHeight / rows;
const bg = 'black';
const fg = 'white';

const settings = {
  dimensions: [cvWidth, cvHeight]
};

const sketch = async () => {

  return ({ context, width, height }) => {
    let x, y;
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < rows * cols; i++) {
      x = (i % cols) * pw;
      y = Math.floor(i / cols) * ph;
    }
  };
};

canvasSketch(sketch, settings);
