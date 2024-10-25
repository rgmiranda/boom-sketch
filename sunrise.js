const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');
const eases = require('eases');

const numDots = 4096 * 8;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `sunrise-${numDots}`
};

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } radius 
 */
const drawDot = (ctx, radius) => {
  const a = math.clamp(random.gaussian(0, Math.PI * 0.125), - Math.PI * 0.5, Math.PI * 0.5);

  const rp = eases.quadOut(((Math.PI * 0.5) - Math.abs(a)) / (Math.PI * 0.5));
  const radiusAmp = radius * 0.1 * rp;
  const r = radius - Math.abs(random.gaussian(0, 1.25)) * radiusAmp;

  const x = Math.cos(a) * r;
  const y = Math.sin(a) * r;

  ctx.beginPath();
  ctx.arc(x, y, random.range(1, 1.75), 0, Math.PI * 2);
  ctx.fill();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'white';
    context.translate(width * 0.5, height * 0.75);
    context.rotate(-Math.PI * 0.5);
    for (let i = 0; i < numDots; i++) {
      drawDot(context, width * 0.48);
    }
  };
};

canvasSketch(sketch, settings);
