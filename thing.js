const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `thing-${Date.now()}`
};

const noiseAmp = 25;
const noiseFreq = 0.005;
const hairCount = 1024;
const step = 4;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } size 
 */
const drawHair = (ctx, size) => {
  const offset = random.rangeFloor(0, 99999);
  let px, py;
  for (let x = 0; x < size; x += step) {
    const y = random.noise1D(x + offset, noiseFreq, noiseAmp);
    const lineWidth = math.lerp(0, 16, eases.circIn((size - x) / size));
    if (x === 0) {
      px = x;
      py = y;
    }
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(x, y);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    px = x;
    py = y;
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    for (let i = 0; i < hairCount; i++) {
      drawHair(context, random.range(width * 0.2, width * 0.6));
      context.rotate(2 * Math.PI / hairCount);
    }
  };
};

canvasSketch(sketch, settings);
