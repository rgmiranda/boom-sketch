const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const createColormap = require('colormap');

const subcircles = 8;
const settings = {
  dimensions: [1080, 1080],
  name: `semis-${Date.now()}`
};
const colors = createColormap({
  colormap: 'bone',
  nshades: subcircles * 2,
  alpha: 1,
  format: 'hex',
});

/**
 * 
 * @param { number } x1 
 * @param { number } x2
 * @param { number } y
 * @param { string } color1 
 * @param { string } color2 
 * @param { CanvasRenderingContext2D } context 
 */
function drawSemis(x1, x2, y, color1, color2, context) {
  const r = (x2 - x1) * 0.25;
  const mid = (x1 + x2) * 0.5;
  context.save();

  context.translate(mid, y);
  context.strokeStyle = color1;

  context.beginPath();
  context.arc(-r, 0, r, Math.PI, Math.PI * 2);
  context.stroke();

  context.beginPath();
  context.arc(r, 0, r, 0, Math.PI);
  context.stroke();

  context.strokeStyle = color2;

  context.beginPath();
  context.arc(r, 0, r, Math.PI, Math.PI * 2);
  context.stroke();

  context.beginPath();
  context.arc(-r, 0, r, 0, Math.PI);
  context.stroke();

  context.restore();
}

const sketch = () => {
  return ({ context, width, height }) => {
    const y = height * 0.5;
    let x1, x2, segSize;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    for (let i = 0; i < subcircles; i++) {
      context.lineWidth = math.mapRange(i, 0, subcircles - 1, 4, 0.1);
      segSize = width / (2 ** i);
      for (let j = 0; j < 2 ** i; j++) {
        x1 = j * segSize;
        x2 = x1 + segSize;
        drawSemis(x1, x2, y, colors[i], colors[subcircles * 2 - i -1], context);
      }
    }
  };
};

canvasSketch(sketch, settings);
