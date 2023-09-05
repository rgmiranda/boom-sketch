const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'inferno',
};

const lines = 128
;
const colors = createColormap({
  colormap: 'inferno',
  nshades: 12,
});

const sketch = () => {
  return ({ context, width, height }) => {
    let x, y, w, gradient;
    const lineWidth = height / lines;

    context.save();

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.lineCap = 'round';
    context.lineWidth = lineWidth;

    context.translate(width * 0.5, height * 0.5);

    context.beginPath();
    /*
    context.moveTo(0, -height * 0.5);
    context.lineTo(Math.cos(Math.PI / 6) * height * 0.5, Math.sin(Math.PI / 6) * height * 0.5);
    context.lineTo(Math.cos(Math.PI * 5 / 6) * height * 0.5, Math.sin(Math.PI * 5 / 6) * height * 0.5);
    context.closePath();
    */
    context.moveTo(-width * 0.5, -height * 0.5);
    context.arc(0, 0, height * 0.5, -Math.PI * 0.5, Math.PI * 0.5);
    context.lineTo(-width * 0.5, height * 0.5);
    context.clip();

    for (let i = 0; i < lines; i++) {
      w = random.rangeFloor(width * 0.2, width);
      x = eases.circOut(random.value()) * width - width * 0.5;
      y = (i + 0.5) * lineWidth - height * 0.5;
      gradient = context.createLinearGradient( (x * 0.5 - w) * 0.5, 0, (x * 0.5 + w) * 0.5, 0);
      colors.forEach((c, j) => {
        gradient.addColorStop(j / (colors.length - 1), c);
      });
      context.beginPath();
      context.moveTo(x - w * 0.5, y);
      context.lineTo(x + w * 0.5, y);
      context.strokeStyle = gradient;
      context.stroke();
    }

    context.restore();
  };
};

canvasSketch(sketch, settings);
