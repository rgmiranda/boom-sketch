
const canvasSketch = require('canvas-sketch');
const color = require('canvas-sketch-util/color');
const math = require('canvas-sketch-util/math');
const createColormap = require('colormap');

const colormap = 'spring';
const settings = {
  dimensions: [1080, 1080],
  name: `hypno-${colormap}`,
  animate: true,
  fps: 12,
};
const curves = 72;
const colors = createColormap({
  colormap,
  nshades: curves * 0.5,
}).reverse().concat(createColormap({
  colormap,
  nshades: curves * 0.5,
}));

const sketch = () =>
{
  return ({ context, width, height, frame }) =>
  {
    const radius = width * 0.49;
    const perimeter = 2 * Math.PI * radius;
    const curvePadding = 0.5 * perimeter / curves;
    const angle = Math.PI / curves;

    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    context.fillStyle = 'white';
    for (let i = 0; i < curves; i++)
    {
      context.globalAlpha = math.mapRange((i + frame) % curves, 0, curves - 1, 1, 0.2, true);
      context.fillStyle = colors[i];
      context.beginPath()
      context.moveTo(0, 0);
      context.bezierCurveTo(- 10 * curvePadding, radius * 0.3, curvePadding * 9, radius * 0.65, 0, radius);
      context.bezierCurveTo(10.25 * curvePadding, radius * 0.60, - curvePadding * 9.75, radius * 0.33, 0, 0);
      context.closePath();
      context.fill();
      context.rotate(angle * 2);
    }
  };
};

canvasSketch(sketch, settings);
