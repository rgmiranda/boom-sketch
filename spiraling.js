const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `spiraling-${seed}`,
};
const noiseFreq = 0.05;
const noiseAmp = 0.5;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } x 
 * @param { number } y 
 * @param { number } r 
 */
const drawCircle = (ctx, x, y, r) => {
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

const sketch = () => {
  return ({ context, width, height }) => {
    let r = 1;
    let angle = 0;
    const arcLength = 5;
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    context.rotate(Math.PI * 0.25);
    while (r < width * 0.5) {
      const perimeter = 2 * Math.PI * r;
      const numArcs = Math.max(perimeter / arcLength, 72);
      const sr = (random.noise1D(r, noiseFreq, noiseAmp) + noiseAmp) * Math.min(r * 0.2, width * 0.5 - r, 50);

      drawCircle(context, Math.cos(angle) * r, Math.sin(angle) * r, sr);

      angle += Math.PI * 2 / numArcs;
      r += 0.25;
    }
  };
};

canvasSketch(sketch, settings);
