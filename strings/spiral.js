const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const colormap = 'magma';

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `spiral-strings-${colormap}-${Date.now()}`
};


const numPoints = 128;
const angle = Math.PI * 2 / numPoints;
const radius = 480;
const points = Array(numPoints).fill(0).map( (e, i) => ({
  x: Math.cos(i * angle) * radius,
  y: Math.sin(i * angle) * radius,
}));

let i = 0;
let j = numPoints * 0.5;
const step = 1.1;
const colors = createColormap({
  colormap,
  nshades: numPoints /  (2 * (step - 1)),
});
console.log(colors.length);

const sketch = ({ width, height, context }) => {
  let from, to, ci = 0;
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  
  context.translate(width * 0.5, height * 0.5);
  
  while (Math.floor(i) !== Math.floor(j)) {
    from = points[Math.floor(i)];
    to = points[Math.floor(j)];
    context.strokeStyle = colors[ci % colors.length];
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    j = (j + 1) % points.length;
    i = (i + step) % points.length;
    ci++;
  }
  return () => {
  };
};

canvasSketch(sketch, settings);
