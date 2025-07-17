const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const eases = require('eases');
const nshades = 12;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `squeeze-${nshades}`
};


const colors = createColormap({
  nshades: nshades + 1,
  colormap: 'greys'
}).slice(1).reverse();

const fgColors = colors.slice(0, Math.round(nshades * 0.5));
const bgColors = colors.slice(Math.round(nshades * 0.5));

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawSqueeze = (context, width, height) => {
  const ox = width * 0.15;
  const dx = width * 0.85;
  const turnSize = (dx - ox) * 0.5;
  const size = (dx - ox) / fgColors.length;

  context.save();
  context.beginPath();
  context.moveTo(ox, 0);
  context.lineTo(dx, 0);
  context.lineTo(dx, height);
  context.closePath();
  context.clip();
  fgColors.forEach((c, i, a) => {
    context.beginPath();
    context.moveTo(ox + (a.length - i - 1) * size, 0);
    context.lineTo(ox + (a.length - i) * size, 0);
    context.lineTo(dx - eases.circIn(1 - i / (a.length - 1)) * turnSize, height);
    context.closePath();
    context.fillStyle = c;
    context.strokeStyle = c;
    context.stroke();
    context.fill();
  });
  context.restore();

  context.save();
  context.beginPath();
  context.moveTo(ox, 0);
  context.lineTo(dx, height);
  context.lineTo(ox, height);
  context.closePath();
  context.clip();
  bgColors.forEach((c, i, a) => {
    context.beginPath();
    context.moveTo(ox + eases.circIn(1 - i / (a.length - 1)) * turnSize, 0);
    context.lineTo(ox + i * size, height);
    context.lineTo(ox + (i + 1) * size, height);
    context.closePath();
    context.fillStyle = c;
    context.strokeStyle = c;
    context.stroke();
    context.fill();
  });
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawSqueeze(context, width, height);
  };
};

canvasSketch(sketch, settings);
