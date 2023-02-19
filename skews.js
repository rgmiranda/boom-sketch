const canvasSketch = require('canvas-sketch');
const { noise3D } = require('canvas-sketch-util/random');

const cvWidth = cvHeight = 1080;
const rows = 20;
const cols = 20;
const noiseFreq = 0.001;
const pw = cvWidth / cols;
const ph = cvHeight / rows;
const bg = 'black';
const fg = 'white';

const settings = {
  dimensions: [cvWidth, cvHeight],
  animate: true,
};

const sketch = async () => {

  return ({ context, width, height, frame }) => {
    let x, y, n, angle, size;
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    context.fillStyle = fg;

    for (let i = 0; i < rows * cols; i++) {
      x = (i % cols) * pw;
      y = Math.floor(i / cols) * ph;

      context.save();
      n = noise3D(x, y, frame * 5, noiseFreq);
      angle = n * Math.PI;
      size = n * 0.5 + 0.5;
      context.translate(x + pw * 0.5, y + ph * 0.5);
      context.rotate(angle);
      
      context.fillRect(-pw * 0.5 * size, -ph * 0.5 * size, pw * size, ph * size);

      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
