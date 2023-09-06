const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'panadero',
};

const numPortals = 16;
const colors =  createColormap({
  colormap: 'copper',
  nshades: numPortals,
});

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    let angle;
    let radius = width * 0.5;
    const minRadius = 5;
    const radiusStep = (radius - minRadius) / numPortals;
    context.translate(width * 0.5, height * 0.5);
    for (let i = 0; i < numPortals; i++) {
      angle = Math.PI / (2 * radius);
      context.fillStyle = colors[i];
      for (let j = 0; j < 4 * radius; j++) {
        const ratio = Math.random() * 0.5 + 0.5;
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, radius * ratio, angle * j, angle * (j + 1));
        context.fill();
      }
      radius -= radiusStep;
    }
  };
};

canvasSketch(sketch, settings);
