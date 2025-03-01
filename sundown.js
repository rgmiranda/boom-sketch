const canvasSketch = require('canvas-sketch');
const { noise2D, noise1D } = require('canvas-sketch-util/random');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'sundown',
};

const freq = 0.025;
let amp = 1000;
const radius = 400;

const colors = createColormap({
  nshades: 12,
  colormap: 'spring'
}).reverse();

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 */
const drawSun = (context) => {
  const stripeSize = radius / (colors.length - 1);
  context.beginPath();
  
  colors.forEach((color, i) =>  {
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = stripeSize - i * 3.1 + 2;

    context.save();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.clip();
    context.beginPath();
    context.moveTo(-radius, -i * stripeSize);
    context.lineTo(radius, -i * stripeSize);
    context.stroke();
    //context.fill();
    context.restore();
    
    context.lineWidth = 1;
    for (let j = 0; j < stripeSize; j++) {
      const y = i * stripeSize + j;
      const x = Math.sqrt(radius * radius - y * y);
      const reflectOffset = noise1D(y, freq, amp * (y / radius));
      
      context.save();
      
      context.translate(reflectOffset, 0);
      context.beginPath();
      context.moveTo(-x, y);
      context.lineTo(x, y);
      context.stroke();

      context.restore();
    }
  });
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.save();

    context.translate(width * 0.5, height * 0.5);
    drawSun(context);

    context.restore();
  };
};

canvasSketch(sketch, settings);
