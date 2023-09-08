const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const numRays = 16 * 16 * 8;
const minRadius = 150;
const maxRadius = 1080 * 0.48;
const colors = createColormap({
  colormap: 'copper',
  nshades: 32,
})

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, height * 0.5);
    let a, s, x, y, g;
    
    for (let i = 0; i < numRays; i++) {
      a = Math.random() * Math.PI * 2;
      s = Math.random() * (width * 0.48 - minRadius);
      x = Math.cos(a);
      y = Math.sin(a);
      context.beginPath();
      g = context.createRadialGradient(0, 0, (minRadius + s * 0.5), 0, 0, (maxRadius - s * 0.5));
      g.addColorStop(0, '#00FFFF00');
      g.addColorStop(0.5, '#00FFFF');
      g.addColorStop(1, '#00FFFF00');
      context.strokeStyle = g;
      context.moveTo(x * (minRadius + s * 0.5), y * (minRadius + s * 0.5));
      context.lineTo(x * (maxRadius - s * 0.5), y * (maxRadius - s * 0.5));
      context.stroke();
      
    }

  };
};

canvasSketch(sketch, settings);
