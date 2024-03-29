const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'string-star'
};

const outerPointsCount = 512;
const innerPointsCount = Math.floor(outerPointsCount * 0.125);
const linesCount = 512;
const outerPointInit = linesCount * 0.75;
const innerPointInit = 0;
const innerRadius = 150;
const outerRadius = 480;

const colors = createColormap({
  nshades: linesCount,
  colormap: 'hsv',
});

const outerPoints = Array(outerPointsCount).fill(0).map((e, idx) => ({
  x: Math.cos((idx + outerPointInit) * Math.PI * 2 / outerPointsCount) * outerRadius,
  y: Math.sin((idx + outerPointInit) * Math.PI * 2 / outerPointsCount) * outerRadius,
}));
const innerPoints = Array(innerPointsCount).fill(0).map((e, idx) => ({
  x: Math.cos((idx + innerPointInit) * Math.PI * 2 / innerPointsCount) * innerRadius,
  y: Math.sin((idx + innerPointInit) * Math.PI * 2 / innerPointsCount) * innerRadius,
}));

console.log(innerPoints);

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    let ii = 0, oi = 0;
    context.translate(width * 0.5, height * 0.5);
    for (let i = 0; i < linesCount; i++) {
      context.strokeStyle = colors[i];
      context.beginPath();
      context.moveTo(innerPoints[ii].x, innerPoints[ii].y);
      context.lineTo(outerPoints[oi].x, outerPoints[oi].y);
      context.stroke();
      oi = (oi + 1) % outerPointsCount;
      ii = (ii + 1) % innerPointsCount;
    }
    context.beginPath();
    context.arc(0, 0, innerRadius, 0, Math.PI * 2);
    context.fillStyle = 'black';
    context.fill();
  };
};

canvasSketch(sketch, settings);
