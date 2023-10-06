const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name:'sun-pyramid'
};
const numLines = 24;
const colors = createColormap({
  colormap: [
    {
      index:0,
      rgb: [166, 124, 0]
    },
    {
      index:0.25,
      rgb: [191, 155, 48]
    },
    {
      index:0.5,
      rgb: [255, 191, 0]
    },
    {
      index:0.75,
      rgb: [255, 207, 64]
    },
    {
      index:1,
      rgb: [255, 220, 115]
    },
  ],
  nshades: numLines
}).reverse();


const sketch = () => {
  return ({ context, width, height }) => {
    const tbase = width * 0.8;
    const theight = tbase * Math.sqrt(3) * 0.5;
    const radiusStep = 0.5 * theight / numLines;
    const tsteph = theight / numLines;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);

    context.save();
    context.translate(0, (-theight + tsteph) * 0.35);

    colors.forEach((c, i) => {
      context.lineWidth = math.mapRange(i, 0, colors.length - 1, 8, 0.1, true);
      context.strokeStyle = c;
      context.beginPath();
      context.arc(0, 0, radiusStep * (i + 1), 0, Math.PI * 2);
      context.stroke();
    });

    context.restore();

    context.translate(0, (theight - tsteph) * 0.65);

    context.beginPath();
    context.moveTo(-tbase * 0.5, 0);
    context.lineTo(tbase * 0.5, 0);
    context.lineTo(0, -theight + tsteph);
    context.closePath();
    context.fill();

    context.lineCap = 'round';
    colors.forEach((color, i) => {
      context.strokeStyle = color;
      context.lineWidth = math.mapRange(i, 0, colors.length - 1, 0.1, 5, true);

      context.beginPath();
      context.moveTo(-tbase * 0.5, 0);
      context.lineTo(0, -tsteph * i);
      context.stroke();

      context.beginPath();
      context.moveTo(tbase * 0.5, 0);
      context.lineTo(0, -tsteph * i);
      context.stroke();
    });

  };
};

canvasSketch(sketch, settings);
