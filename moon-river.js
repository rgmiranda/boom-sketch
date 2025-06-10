const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'moon-river'
};

const colors = createColormap({
  colormap: 'bone',
  nshades: 24
}).reverse();

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawSunset = (context, width, height) => {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const r = width * 0.35;
  const ypad = 30;
  let lineWidth = 0.5;

  const grad = context.createLinearGradient(width, 0, 0, height);
  colors.forEach((c, i) => {
    grad.addColorStop(i / (colors.length - 1), c);
  });

  context.fillStyle = grad;
  context.beginPath();
  context.arc(cx, cy, r, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = 'black';
  let y = height * 0.6;
  while (y < height) {
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
    lineWidth += 2;
    y += ypad;
  }
  
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawSunset(context, width, height);
  };
};

canvasSketch(sketch, settings);
