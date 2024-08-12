const canvasSketch = require('canvas-sketch');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'blueprint-sphere',
};

const numLines = 16;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } radius 
 * @param { number } porc 
 */
const drawArc = (ctx, radius, porc) => {
  ctx.lineWidth = (1 - porc) * 1.5 + 0.5;
  if (porc === 0) {
    ctx.beginPath();
    ctx.moveTo(-radius, 0);
    ctx.lineTo(radius, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(0, radius);
    ctx.stroke();
    return;
  }
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * porc, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, 0, radius * porc, radius, 0, 0, Math.PI * 2);
  ctx.stroke();
};

const sketch = ({ width, height }) => {
  const radius = width * 0.48;
  return ({ context }) => {
    context.fillStyle = '#000066';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    for (let i = 0; i < numLines; i++) {
      drawArc(context, radius, eases.quadOut(i / (numLines - 1)));
    }
  };
};

canvasSketch(sketch, settings);
