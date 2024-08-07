const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `aztec-${seed}`,
};

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } radius 
 * @param { number } size 
 * @param { boolean } inner 
 */
const drawCircumference = (ctx, radius, size, inner = false) => {
  const numAngles = Math.floor(2 * Math.PI * radius / size);
  const angleSize = 2 * Math.PI / numAngles;
  ctx.save();
  const p = 0.5;
  for (let i = 0; i < numAngles; i++) {
    if (random.chance(p)) {
      ctx.beginPath();
      ctx.moveTo(0, radius);
      ctx.lineTo(0, radius + size * 0.5);
      ctx.stroke();
    }
    if (random.chance(p)) {
      ctx.beginPath();
      ctx.moveTo(0, radius + size * 0.5);
      ctx.lineTo(0, radius + size);
      ctx.stroke();
    }
    if (inner && random.chance(p + 0.25)) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, -angleSize * 0.5, 0);
      ctx.stroke();
    }
    if (inner && random.chance(p + 0.25)) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, angleSize * 0.5);
      ctx.stroke();
    }
    if (random.chance(p)) {
      ctx.beginPath();
      ctx.arc(0, 0, radius + size, -angleSize * 0.5, 0);
      ctx.stroke();
    }
    if (random.chance(p)) {
      ctx.beginPath();
      ctx.arc(0, 0, radius + size, 0, angleSize * 0.5);
      ctx.stroke();
    }
    ctx.rotate(angleSize);
  }
  ctx.restore();
};

const sketch = ({ width, height }) => {
  const minRadius = 35;
  const maxRadius = width * 0.5;
  const size = 25;
  return ({ context }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.lineCap = 'round';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.35, height * 0.5);
    let radius = minRadius;
    while (radius < maxRadius) {
      context.lineWidth = math.mapRange(radius, minRadius, maxRadius, 3, 0.25);
      drawCircumference(context, radius, size, radius === minRadius);
      radius += size;
    }
    
    context.translate(-width * 0.35, -height * 0.5);
  };
};

canvasSketch(sketch, settings);
