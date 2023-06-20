const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const numCircles = 64;
const colors = createColormap({
  colormap: 'plasma',
  nshades: numCircles,
});
const outerRadius = 480;
const innerRadius = -100;
const radius = (outerRadius - innerRadius) * 0.5;
const angle = 2 * Math.PI / numCircles;
const settings = {
  dimensions: [ 1080, 1080 ],
  name: `circle-strings-${Date.now()}`,
};

const sketch = ({ context, width, height }) => {
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  //context.globalCompositeOperation = 'lighten';
  context.translate(width * 0.5, height * 0.5);
  for (let i = 0; i < numCircles; i++) {
    context.rotate(angle);
    context.save();
    context.translate(0, (outerRadius + innerRadius) * 0.5);
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.strokeStyle = colors[i];
    context.stroke();
    context.restore();
  }
  return () => {
  };
};

canvasSketch(sketch, settings);
