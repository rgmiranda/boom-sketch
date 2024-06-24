const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'distorted',
};

const pixels = 8;
const fillColors = [
  '#AAAAAA',
  '#666666',
];
const backColors = [
  '#000000',
  '#FFFFFF',
];
const roundness = 0.25;

const sketch = ({ width, height }) => {
  const pw = width / (pixels * 2 + 1);
  const ph = height / (pixels * 2 + 1);
  return ({ context }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    let offset = 0;
    let suboffset = 0;
    
    for (let j = 0; j < pixels; j++) {
      const y1 = (pixels - j) * ph;
      const y2 = (pixels + 1 + j) * ph;
      for (let i = 0; i < pixels; i++) {
        const x1 = (pixels - i) * pw;
        const x2 = (pixels + 1 + i) * pw;

        if (i > pixels * 0.5 || j > pixels * 0.5) {
          suboffset = 1;
        } else {
          suboffset = 0;
        }

        context.beginPath();
        context.arc(x1, y1, pw * roundness, 0, Math.PI * 2);
        context.fillStyle = backColors[(i + offset+ suboffset) % 2];
        context.fill();

        context.beginPath();
        context.arc(x1, y2, pw * roundness, 0, Math.PI * 2);
        context.fillStyle = backColors[(i + offset+ suboffset) % 2];
        context.fill();

        context.beginPath();
        context.arc(x2, y1, pw * roundness, 0, Math.PI * 2);
        context.fillStyle = backColors[(i + offset+ suboffset) % 2];
        context.fill();

        context.beginPath();
        context.arc(x2, y2, pw * roundness, 0, Math.PI * 2);
        context.fillStyle = backColors[(i + offset+ suboffset) % 2];
        context.fill();
      }
      offset = (offset + 1) % 2;
    }

    offset = 1;
    for (let j = 0; j < 2 * pixels + 1; j++) {
      const y = j * ph;
      for (let i = 0; i < 2 * pixels + 1; i++) {
        const x = i * pw;
        context.beginPath();
        context.roundRect(x, y, pw, ph, pw * roundness);
        context.fillStyle = fillColors[(i + offset) % 2];
        context.fill();
      }
      offset = (offset + 1) % 2;
    }
  };
};

canvasSketch(sketch, settings);
