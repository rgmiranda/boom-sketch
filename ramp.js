const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ]
};
const step = 10;
//const phi = (1 + Math.sqrt(5)) * 0.5;
const phi = 1.1;

const colors = createColormap({
  nshades: 875,
  colormap: 'bone',
})

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawRamp = (context, width, height) => {
  context.save();
  let radius = 5;

  context.translate(width * 0.5, height * 0.5);
  colors.forEach((color, i) => {
    const perimeter = radius * 2 * Math.PI;
    const angleCount = perimeter / step;
    const angle = 2 * Math.PI / angleCount;
    const ratio = (4 * (phi - 1) / angleCount) + 1
    
    context.beginPath();
    context.moveTo(0, radius);
    context.lineTo(0, Math.max(radius, height * Math.SQRT2));
    context.rotate(angle);
    radius = ratio * radius;
    context.lineTo(0, Math.max(radius, height * Math.SQRT2));
    context.lineTo(0, radius);
    context.closePath();
    context.strokeStyle = color;
    context.fillStyle = color;
    context.stroke();
    context.fill();
  });
  
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawRamp(context, width, height);
  };
};

canvasSketch(sketch, settings);
