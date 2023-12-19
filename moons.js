const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  fps: 60,
  name: 'moons'
};

const numCircles = 16;
const moonRadius = 20;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } x 
 * @param { number } y 
 * @param { number } radius 
 * @param { number } phase 
 * @param { number } angle 
 */
const drawMoon = (ctx, x, y, radius, phase, angle = 0) => {
  ctx.save();

  ctx.translate(x, y);
  ctx.rotate(angle);
  
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  let cpx, mcpx;
  if (phase < 0.5) {
    mcpx = -Math.SQRT2 * radius;
    cpx = math.mapRange(phase, 0, 0.5, -Math.SQRT2 * radius, Math.SQRT2 * radius, true);
  } else {
    mcpx = Math.SQRT2 * radius;
    cpx = math.mapRange(phase, 0.5, 1, -Math.SQRT2 * radius, Math.SQRT2 * radius, true);
  }
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.bezierCurveTo(mcpx, -radius, mcpx, radius, 0, radius);
  ctx.bezierCurveTo(cpx, radius, cpx, -radius, 0, -radius);
  ctx.closePath();
  ctx.fillStyle = 'black';
  ctx.fill();

  ctx.restore();
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);

    const radiusPadding = width * Math.SQRT1_2 / numCircles;
    for (let i = 1; i <= numCircles; i++) {
      const radius = radiusPadding * i;
      const perimeter = 2 * Math.PI * radius;
      const moonCount = perimeter / (3 * moonRadius);
      const angle = 2 * Math.PI / moonCount;
      const phase = ((frame - i * 22) % 200) / 200;
      for (let j = 0; j < moonCount; j++) {
        const x = Math.cos(angle * j) * radius;
        const y = Math.sin(angle * j) * radius;
        drawMoon(context, x, y, moonRadius, phase, angle * j);
      }

    }

  };
};

canvasSketch(sketch, settings);
