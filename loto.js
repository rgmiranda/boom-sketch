const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');
const createColormap = require('colormap');
const points = 24;
const colormap = 'inferno';
const ratio = 0.875;
const initWidth = 100;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `loto-${colormap}-${points}-${initWidth}`
};

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } points 
 * @param { number } outerRadius 
 * @param { number } innerRadius 
 */
const drawStar = (ctx, points, outerRadius, innerRadius) => {
  const angle = 2 * Math.PI / points;
  let x, y;
  ctx.beginPath();
  ctx.moveTo(outerRadius, 0);
  for (let i = 0; i < points; i++) {
    x = Math.cos(i * angle) * outerRadius;
    y = Math.sin(i * angle) * outerRadius;
    ctx.lineTo(x, y);
    x = Math.cos((i + 0.5) * angle) * innerRadius;
    y = Math.sin((i + 0.5) * angle) * innerRadius;
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
};

const sketch = ({ width, height }) => {

  const circles = [];
  let outerRadius = width * Math.SQRT1_2;
  let currentWidth = initWidth;
  let innerRadius;
  while (outerRadius > 5) {
    innerRadius = outerRadius - currentWidth;
    circles.push({
      outerRadius,
      innerRadius,
    });
    outerRadius = innerRadius;
    currentWidth *= ratio;
    currentWidth = math.clamp(currentWidth, 5, initWidth);
  }
  
  const colors = createColormap({
    colormap,
    nshades: circles.length
  })

  return ({ context }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    context.rotate(-Math.PI * 0.5);
    
    circles.forEach(({ outerRadius, innerRadius }, i) => {
      context.strokeStyle = colors[i];
      context.fillStyle = colors[i];
      context.lineWidth = math.lerp(1, 4, (circles.length - i - 1) / (circles .length - 1));
      drawStar(context, points, outerRadius, innerRadius);
      context.rotate(Math.PI / points);
    });
  };
};

canvasSketch(sketch, settings);
