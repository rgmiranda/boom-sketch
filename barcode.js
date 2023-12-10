const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `barcodes-${seed}`
};
const colors = [
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
];
const numGroups = 24;

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = '#F2EECB';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);

    for (let i = 0; i < numGroups; i++) {
      const numBars = random.rangeFloor(16, 32);
      const barWidth = random.range(1, 4);
      const innerRadius = random.range(width * 0.125, width * 0.25);
      const outerRadius = random.range(innerRadius, width * 0.5);
      const baseAngle = random.range(0, Math.PI * 2);
      const anglePad = barWidth * Math.PI / 360;
      context.save();
      context.rotate(baseAngle);
      context.lineWidth = barWidth;
      context.strokeStyle = random.pick(colors);
      for (let j = 0; j < numBars; j++) {
        context.beginPath();
        context.moveTo(0, innerRadius);
        context.lineTo(0, outerRadius);
        context.stroke();
        context.rotate(anglePad);
      }
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
