const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'stargate'
};
const colors = createColormap({
  colormap: 'hsv',
  nshades: 16,
  alpha: 1,
  format: 'hex'
})

const sketch = () => {
  return ({ context, width, height }) => {
    /** @type { CanvasGradient } */
    const gradient = context.createConicGradient(0, 0, 0);
    colors.forEach((c, i) => {
      gradient.addColorStop(i / (colors.length - 1), c);
    });

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = gradient;
    context.lineWidth = 20;
    context.translate(width * 0.5, height * 0.5);

    context.beginPath();
    context.arc(0, 0, 400, 0, Math.PI * 2);
    
    context.save();
    context.filter = 'blur(50px)'
    context.stroke();
    context.stroke();
    context.stroke();
    context.stroke();
    context.stroke();
    context.stroke();
    context.stroke();
    context.restore();
    
    context.globalCompositeOperation = 'screen';
    context.stroke();

  };
};

canvasSketch(sketch, settings);
