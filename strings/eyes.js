const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const colormap = 'magma';

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `eyes-strings-${colormap}-${Date.now()}`
};

const numPoints = 128;
const angle = Math.PI * 2 / numPoints;
const radius = 480;
const points = Array(numPoints).fill(0).map( (e, i) => ({
  x: Math.cos(i * angle) * radius,
  y: Math.sin(i * angle) * radius,
}));

const colors = createColormap({
  colormap,
  nshades: numPoints,
});

function arrayRange(start, stop, step) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );
}

const paths = [
  {
    from: arrayRange(0, Math.round(numPoints * 0.25) - 1, 1),
    to: arrayRange(Math.round(numPoints * 0.4), Math.round(numPoints * 0.65) - 1, 1),
  },
];

console.log(paths);

const sketch = ({ width, height, context }) => {
  let from, to;
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  
  context.strokeStyle = 'white';
  context.translate(width * 0.5, height * 0.5);

  paths.forEach(path => {
    for (let i = 0; i < path.from.length; i++) {
      from = points[path.from[i]];
      to = points[path.to[i]];
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
  });
  
  return () => {
  };
};

canvasSketch(sketch, settings);
