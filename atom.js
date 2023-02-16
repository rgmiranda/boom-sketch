const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { range, getRandomSeed, setSeed } = require('canvas-sketch-util/random');
const cvWidth = cvHeight = 1080;
const seed = getRandomSeed();
setSeed(seed);
const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name: seed
};

const numElectrons = 128;
const minRadiusRatio = 0.1;
const lineWidth = 2;
const minRadius = cvWidth * minRadiusRatio;
const radiusPadding = cvWidth * ( 0.5 - minRadiusRatio) / numElectrons;
const electrons = [];

const sketch = () => {
  let angleOffset;
  for (let i = 0; i < numElectrons; i++) {
    angleOffset = range(0, Math.PI * 2);
    electrons.push({
      radius: minRadius + i * radiusPadding,
      startAngle: range(-Math.PI, 0) + angleOffset,
      endAngle: range(0, Math.PI) + angleOffset,
    });
  }
  return ({ context, width, height }) => {
    /** @type { CanvasGradient } */
    let gradient, da, colorStop, x, y;

    context.fillStyle = 'black';
    context.lineWidth = lineWidth;
    context.fillRect(0, 0, width, height);
    context.lineCap = 'round';

    for (const e of electrons) {

      da = e.endAngle - e.startAngle;
      colorStop = mapRange(da, 0, Math.PI * 2, 0, 1, true);
      gradient = context.createConicGradient(e.startAngle, width * 0.5, height * 0.5);
      gradient.addColorStop(0, '#FFFF');
      gradient.addColorStop(colorStop, '#0000');
      context.strokeStyle = gradient;

      context.save();

      context.beginPath();
      context.arc(width * 0.5, height * 0.5, e.radius, e.startAngle, e.endAngle);
      context.stroke();

      context.restore();
    }

    for (const e of electrons) {

      x = width * 0.5 + Math.cos(e.startAngle) * e.radius;
      y = height * 0.5 + Math.sin(e.startAngle) * e.radius;

      console.log(x, y);

      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2);
      gradient = context.createRadialGradient(x, y, 2, x, y, 10);
      gradient.addColorStop(0, '#FFFF');
      gradient.addColorStop(1, '#FFF0');
      context.fillStyle = gradient;
      context.fill();
    }
  };
};

canvasSketch(sketch, settings);
