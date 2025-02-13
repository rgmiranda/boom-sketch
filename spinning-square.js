const { Vector } = require('@rgsoft/math');
const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const eases = require('eases');

const lineWidth = 6;
const speed = 0.01;
const easing = eases.quadInOut;

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'spinning-square'
};

const colors = createColormap({
  nshades: 32,
  colormap: 'spring',
}).reverse();

const maxDepth = colors.length;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } w 
 * @param { Vector[] } s
 * @param { number } depth 
 */
const drawSquare = (ctx, s, p, depth) => {
  const [a, b, c, d] = s;
  
  const p1 = Vector.sub(b, a);
  p1.mult(p).add(a);
  const p2 = Vector.sub(c, b);
  p2.mult(p).add(b);
  const p3 = Vector.sub(d, c);
  p3.mult(p).add(c);
  const p4 = Vector.sub(a, d);
  p4.mult(p).add(d);

  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.lineTo(p4.x, p4.y);
  ctx.closePath();
  ctx.strokeStyle = colors[depth];
  ctx.stroke();

  if (depth < maxDepth) {
    drawSquare(ctx, [p1, p2, p3, p4], p, depth + 1);
  }
}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.clearRect(0, 0, width, height);
    context.lineWidth = lineWidth;

    context.globalCompositeOperation = 'lighter';
    
    //const prop = Math.cos(frame * 0.01) * 0.5 + 0.5;
    const prop = easing((frame * speed) % 1);
    
    drawSquare(context, [
      new Vector(lineWidth * 0.5, lineWidth * 0.5),
      new Vector(width - lineWidth * 0.5, lineWidth * 0.5),
      new Vector(width - lineWidth * 0.5, height - lineWidth * 0.5),
      new Vector(lineWidth * 0.5, height - lineWidth * 0.5),
    ], prop, 0);
    
    context.globalCompositeOperation = 'destination-over';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
