const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'muzzle'
};

const length = 480;
const radius = 200;

const turns = 128;
const rotationAngle = 2 * Math.PI / turns;

const colors = createColormap({
  nshades: 32,
  colormap: 'copper'
})

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.lineWidth = 2;
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, height * 0.5);

    /** @type { CanvasGradient } */
    const grad1 = context.createLinearGradient(0, 0, 0, length);
    const grad2 = context.createLinearGradient(0, 0, 0, length);
    colors.forEach((c, i) => {
      grad1.addColorStop(i / (colors.length - 1), c);
      grad2.addColorStop((colors.length - i - 1)/ (colors.length - 1), c);
    });

    for (let i = 0; i < turns; i++) {
      context.strokeStyle = i < turns * 0.5 ? grad2 : grad1;
      context.beginPath();
      context.moveTo(-radius, 0);
      context.lineTo(-radius, length);
      context.stroke();
      context.rotate(rotationAngle);
    }



  };
};

canvasSketch(sketch, settings);
