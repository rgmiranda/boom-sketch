const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'oscillator'
};

const radius = 400;
const angles = [
  0,
  Math.PI * 0.5,
  Math.PI * 0.25,
  Math.PI * 0.75,
  Math.PI * 0.125,
  3 * Math.PI * 0.125,
  5 * Math.PI * 0.125,
  7 * Math.PI * 0.125,
];
let displayedAngles = 1;
const step = 0.1;
const displayTimeFrame = 5;

const sketch = () => {
  let totalDelta = 0;
  return ({ context, width, height, frame, deltaTime }) => {

    totalDelta += deltaTime;
    console.log(deltaTime, totalDelta, displayTimeFrame);
    if (totalDelta >= displayTimeFrame) {
      displayedAngles += displayedAngles < angles.length ? 1 : 0;
      totalDelta = 0;
    }

    let angle, x, y;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    context.fillStyle = 'white';
    context.strokeStyle = 'grey';
    for (let i = 0; i < displayedAngles; i++) {
      angle = angles[i];
      context.save();
      context.rotate(angle);
      x = 0;
      y = Math.sin(angle + step * frame) * radius

      context.beginPath();
      context.moveTo(0, -radius);
      context.lineTo(0, radius);
      context.stroke();

      context.beginPath();
      context.arc(x, y, 20, 0, Math.PI * 2);
      context.closePath();
      context.fill();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
