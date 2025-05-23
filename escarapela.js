const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'escarapela',
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } points 
 * @param { number } radius 
 * @param { number } minRadius 
 * @param { boolean } invert
 */
const plotPoints = (context, width, height, points, radius, minRadius = 0, invert = false) => {
  context.save();
  context.translate(width * 0.5, height * 0.5);
  if (invert) {
    context.rotate(Math.PI);
  }
  for (let i = 0; i < points; i++) {
    const s = random.range(0.5, 2);
    const r = minRadius === 0 ? 
      Math.sqrt(random.value()) * radius
      : random.range(minRadius, radius);
    const a = random.gaussian(0, 0.3 * Math.PI);
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    context.beginPath();
    context.arc(x, y, s, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    //context.fillStyle = 'white';
    context.fillStyle = '#b79a00';
    plotPoints(context, width, height, 4096 * 2, 125, 0, false);
    context.fillStyle = '#1f3d59';
    plotPoints(context, width, height, 4096 * 16, 325, 125, true);
    plotPoints(context, width, height, 4096 * 32, 500, 325, false);
  };
};

canvasSketch(sketch, settings);
