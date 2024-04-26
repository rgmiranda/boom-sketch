const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const eases = require('eases');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `ray-burst-${seed}`,
};

const numRays = 2048;
const minRadius = 25;

const colors = createColormap({
  nshades: 24,
  colormap: 'jet',
  alpha: [0, 1],
  format: 'rgbaString',
}).reverse();

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } width 
 * @param { number } height 
 */
const drawRay = (ctx, width, height) => {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const a = random.range(0, Math.PI * 2);
  const r = random.range(minRadius, width * 0.9);
  const lw = 2.5 * eases.circOut((width * 0.9 - r) / (width * 0.9)) + 0.5;
  
  ctx.save();
  
  ctx.translate(cx, cy);
  ctx.rotate(a);
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  colors.forEach((c, i) => gradient.addColorStop(i / (colors.length - 1), c));
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(r, -lw);
  ctx.arc(r, 0, lw, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.lineTo(r, lw);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.restore();
};

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } width 
 * @param { number } height 
 */
const drawNegative = (ctx, width, height) => {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const a = random.range(0, Math.PI * 2);
  const r = random.range(minRadius, width * Math.SQRT1_2);
  const lw = 7.5 * eases.circOut((width * Math.SQRT1_2 - minRadius - r) / (width * Math.SQRT1_2 - minRadius)) + 0.5;
  
  ctx.save();
  
  ctx.translate(cx, cy);
  ctx.rotate(a);

  ctx.beginPath();
  ctx.arc(r, 0, lw, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();

  const gradient = ctx.createRadialGradient(r, 0, r, 0, 0, width * Math.SQRT1_2 - r);
  gradient.addColorStop(0, '#000000AA');
  gradient.addColorStop(1, '#00000000');
  
  ctx.beginPath();
  ctx.moveTo(r, -lw);
  ctx.lineTo(width * Math.SQRT1_2, (-lw / r) * width * Math.SQRT1_2);
  ctx.lineTo(width * Math.SQRT1_2, (lw / r) * width * Math.SQRT1_2);
  ctx.lineTo(r, lw);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < numRays; i++) {
      drawRay(context, width, height);
      if (random.chance(0.035)) {
        drawNegative(context, width, height);
      }
    }
  };
};

canvasSketch(sketch, settings);
