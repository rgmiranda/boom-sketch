const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `triblob-${Date.now()}`,
};

const colors = createColormap({
  colormap: 'cool',
  nshades: 16,
});

const numPoints = 36;
const angleStep = 2 * Math.PI / numPoints;
const radius = 350;
const subradius = 130;
const subangleStep = 2 * Math.PI / 120;
const subangles = Array(Math.floor(numPoints)).fill(0).map((e, i) => e - angleStep * i * 2);
const sketch = ({ context }) => {
  const gradient = context.createRadialGradient(0, 0, radius - subradius, 0, 0, radius + subradius);
  colors.forEach((c, i, arr) => gradient.addColorStop(i / (arr.length - 1), c))
  return ({ context, width, height }) => {
    let x, y;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, height * 0.5);

    context.fillStyle = gradient;
    for (let i = 0; i < numPoints; i++) {
      x = Math.cos(angleStep * i) * radius + Math.cos(subangles[i]) * subradius;
      y = Math.sin(angleStep * i) * radius + Math.sin(subangles[i]) * subradius;
      context.beginPath();
      context.arc(x, y, 8, 0, Math.PI * 2);
      context.fill();
    }
    subangles.forEach((v, i, arr) => arr[i] = v + subangleStep);
  };
};

canvasSketch(sketch, settings);
