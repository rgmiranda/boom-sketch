const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const cvWidth = cvHeight = 1080;
const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

const numPoints = 3;
const points = Array(numPoints).fill(0).map(() => ({
  x: random.rangeFloor(0, cvWidth),
  y: random.rangeFloor(0, cvHeight),
}));

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach((p, i) => {
      if ( i < numPoints - 1) {
        context.beginPath();
        for (let j = i + 1; j < numPoints; j++) {
          const pd = points[j];
          const x = (p.x + pd.x) * 0.5;
          const y = (p.y + pd.y) * 0.5;
  
        }
      }
      context.fillStyle = '#999999';
      context.strokeStyle = '#000000';
      context.beginPath();
      context.arc(p.x, p.y, 5, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
