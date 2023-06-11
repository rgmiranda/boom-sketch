const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'fibo'
};

const scale = 5;
const numArcs = 10;

const colors = createColormap({
  colormap: 'cool',
  nshades: numArcs,
}).reverse();

const radiuses = [1 * scale, 2 * scale];
const centers = [
  {x: 0 * scale, y: 0 * scale},
  {x: -1 * scale, y: 0 * scale},
];
const centerGenerators = [
  {x: 0, y: 1},
  {x: -1, y: 0},
  {x: 0, y: -1},
  {x: 1, y: 0},
];
while (radiuses.length < numArcs) {
  const pr = radiuses[radiuses.length - 2];
  const pc = centers[radiuses.length - 1];
  const ci = (radiuses.length % centerGenerators.length);
  const nr = radiuses[radiuses.length - 1] + radiuses[radiuses.length - 2];
  const c = {
    x: centerGenerators[ci].x * pr + pc.x,
    y: centerGenerators[ci].y * pr + pc.y,
  };
  centers.push(c);
  radiuses.push(nr);
}
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.62, height * 0.44);
    
    radiuses.forEach((r, i) => {
      context.lineWidth = math.mapRange(i, 0, radiuses.length - 1, 5, 10);
      const c = centers[i];
      context.strokeStyle = colors[i];
      context.beginPath();
      context.arc(c.x, c.y, r, 0, Math.PI * 2);
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
