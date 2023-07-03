const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `spiral-circle-${Date.now()}`
};
const bg = 'black';
const numCircles = 16;
const colors = createColormap({
  colormap: 'copper',
  nshades: numCircles,
});
const maxRadius = 500;
const minRadius = 10;
const circleStep = (maxRadius - minRadius) / numCircles;
const scale = 0.9;

const sketch = () => {
  /** @type { CanvasGradient } */
  let gradient, center, radius, fg;
  return ({ context, width, height }) => {
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, height * 0.5);

    for (let i = 0; i < numCircles; i++) {
      fg = colors[i];
      center = {
        x: circleStep * 0.5 * Math.cos(scale * i),
        y: circleStep * 0.5 * Math.sin(scale * i),
      };
      radius = maxRadius - (circleStep * i)
      gradient = context.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
      gradient.addColorStop(0, bg);
      gradient.addColorStop(0.95 * math.mapRange(i, 0, numCircles - 1, 1, 0.9), bg);
      gradient.addColorStop(1, fg);
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.fill();
    }
  };
};

canvasSketch(sketch, settings);
