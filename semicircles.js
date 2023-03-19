const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const circleCount = 128;

const colors = createColormap({
  colormap: 'magma',
  nshades: circleCount,
  alpha: 1,
  format: 'hex'
});
const cols = 8;
const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {

    const radius = width / (2 *cols);
    const circlePadding = (height +  2 * radius) / circleCount;

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.lineWidth = 1;

    for (let j = 0; j < circleCount; j ++) {
      let startAngle = Math.PI;
      context.strokeStyle = colors[j];
      
      for (let i = 0; i < cols; i++) {
        context.save();
        context.translate(i * 2 * radius + radius, j * circlePadding - radius);

        context.beginPath();        
        context.arc(0, 0, radius, startAngle, startAngle + Math.PI);
        context.stroke();

        startAngle += Math.PI;
        context.translate(radius, 0);
        context.restore();
      }

    }


  };
};

canvasSketch(sketch, settings);
