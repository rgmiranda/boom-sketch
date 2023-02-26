const canvasSketch = require('canvas-sketch');
const { rangeFloor } = require('canvas-sketch-util/random');
const createColormap = require('colormap');

const cvWidth = cvHeight = 1080;

const lines = 256;
const angleStep = Math.PI * 2 / lines;
const sunRadius = 200;
let sizes;

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};
const nshades = 16;
const gradientColors = createColormap({
  colormap: 'temperature',
  nshades, 
  format: 'hex',
  alpha: 1
});

const sketch = ({width, context}) => {
  const gradient = context.createRadialGradient(0, 0, sunRadius, 0, 0, width * 0.5);
  for (let i = 0; i < nshades; i++) {
    gradient.addColorStop(i / nshades, gradientColors[nshades - i - 1]);
  }
  sizes = Array(lines).fill().map(() => rangeFloor(sunRadius * 1.5, width * 0.5));
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    
    context.lineWidth = 3;
    
    for (let i = 0; i < lines; i++) {
      context.save();
      
      context.translate(width * 0.5, height * 0.5);
      context.strokeStyle = gradient;
      context.rotate(angleStep * i);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, sizes[i]);
      context.stroke();

      context.restore();
    }

    context.beginPath();
    context.arc(width * 0.5, height * 0.5, sunRadius, 0, Math.PI * 2);
    context.fill();
  };
};

canvasSketch(sketch, settings);
