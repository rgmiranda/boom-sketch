const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const eases = require('eases');

const cvWidth = cvHeight = 1080;
const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name: `upside-down-${Date.now()}`
};

const upColor = 'black';
const downColor = 'red';

const points = 1080 * 0.25;
const lw = cvWidth / points;

const sketch = () => {
  return ({ context, width, height }) => {
    let h, gradient, amp;

    context.fillStyle = downColor;
    context.fillRect(0, 0, width, height * 0.5);
    context.fillStyle = upColor;
    context.fillRect(0, height * 0.5, width, height);
    context.lineWidth = lw;
    for (let i = 0; i < points; i++) {
      if (i < points * 0.5) {
        amp = eases.circIn(math.mapRange(i, 0, points * 0.5, 0.01, 1)) * height * 0.35;
      } else {
        amp = eases.circIn(math.mapRange(i, points * 0.5, points, 1, 0.01)) * height * 0.35;
      }
      h = random.noise1D(i, 0.1, amp) + amp;
      //h = random.value() * height * 0.5;
      gradient = context.createLinearGradient(0, height * 0.5, 0, height * 0.5 - h);
      gradient.addColorStop(0, upColor);
      gradient.addColorStop(0.75, upColor);
      gradient.addColorStop(1, downColor);
      context.beginPath();
      context.moveTo((i + 1) * lw, height * 0.5);
      context.lineTo((i + 1) * lw, height * 0.5 - h);
      context.strokeStyle = gradient;
      context.stroke();

      gradient = context.createLinearGradient(0, height * 0.5, 0, height * 0.5 + h);
      gradient.addColorStop(0, downColor);
      gradient.addColorStop(0.75, downColor);
      gradient.addColorStop(1, upColor);
      context.beginPath();
      context.moveTo((i + 1) * lw, height * 0.5);
      context.lineTo((i + 1) * lw, height * 0.5 + h);
      context.strokeStyle = gradient;
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
