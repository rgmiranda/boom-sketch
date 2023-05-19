const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `circlipper-${seed}`
};

const lines = 12;
const points = 256;
const noiseScale = 0.01;
const noiseAmp = 100;
const repeat = 20;
const lineWidth = 3;

const colors = createColormap({
  colormap: 'spring',
  nshades: lines,
  alpha: 1,
  format: 'hex'
});

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();

    context.beginPath();
    context.arc(width * 0.5, height * 0.5, 500, 0, Math.PI * 2);
    context.clip();

    const yPad = height / lines;
    const xPad = width / points;

    for (let j = 0; j < lines; j++) {
      const noiseOffset = random.rangeFloor(0, points);
      context.save();
      for (let k = 0; k < repeat; k++) {
        context.beginPath();
        context.moveTo(0, width);
        context.lineWidth = lineWidth;
        for (let i = 0; i < points; i++) {
          const x = xPad * i;
          const y = yPad * j + random.noise2D(i + noiseOffset, j + k, noiseScale, noiseAmp);
          context.lineTo(x, y);
        }
        context.lineTo(height, width);
        context.closePath();
        context.fillStyle = 'black'
        context.strokeStyle = colors[lines - j - 1];
        context.fill();
        context.stroke();
        context.translate(0, lineWidth * 4);
      }
      context.restore();
    }

    context.restore();

    context.beginPath();
    context.arc(width * 0.5, height * 0.5, 500, 0, Math.PI * 2);
    context.globalCompositeOperation = 'color-burn';

    context.strokeStyle = 'orange';
    context.lineWidth = 20;
    context.stroke();
  };
};

canvasSketch(sketch, settings);
