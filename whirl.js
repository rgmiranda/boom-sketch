const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const createColormap = require('colormap');

const settings = {
  dimensions: [1080, 1080],
  name: `whirl`,
  animate: true,
  fps: 36,
};

const segmentCount = 128 + 64;
const angle = Math.PI / 36;
const numLines = 4;
const lineAngle = 2 * Math.PI / numLines;
const lineWidth = 15;

const sketch = () =>
{
  return ({ context, width, height, frame }) =>
  {
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    context.strokeStyle = 'white';
    context.lineCap = 'round';
    
    context.rotate(-frame * 0.1);
    
    for (let j = 0; j < numLines; j++) {
      let r = 1;
      let px = 0, py = 0, x, y;
      for (let i = 0; i < segmentCount; i++)
      {
        context.lineWidth = lineWidth * math.mapRange(i, 0, segmentCount - 1, 1, 0, true);
        context.beginPath();
        context.moveTo(px, py);
        x = Math.cos(i * angle) * r;
        y = Math.sin(i * angle) * r;
        context.lineTo(x, y);
        px = x;
        py = y;
        r += 2;
        context.stroke();
      }
      context.rotate(lineAngle);
    }
  };
};

canvasSketch(sketch, settings);
