const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const { Vector } = require('p5');
const seed = random.getRandomSeed();

const numPoints = 1024;
const settings = {
  dimensions: [ 1080, 1080 ],
  name: `tide-${seed}`,
  animate: true,
};
const freq = 0.0125;
const amp = 60;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { Vector[] } points 
 * @param { number } frame 
 */
const drawPoints = (ctx, points, frame) => {
  ctx.fillStyle = 'white';
  points.forEach(p => {
    const d = Math.sqrt(p.x * p.x + p.y * p.y);
    const o = new Vector(Math.cos((d - frame) * freq) * amp, Math.sin((d - frame) * freq) * amp);
    ctx.beginPath();
    ctx.arc(p.x + o.x, p.y + o.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

const sketch = ({ width, height }) => {
  random.setSeed(seed);
  /**
   * @type { Vector[] }
   */
  const points = Array(numPoints).fill(false).map(() => new Vector(random.range(-width * 0.5, width * 0.5), random.range(-height * 0.5, height * 0.5)));

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);

    drawPoints(context, points, frame * 10);
  };
};

canvasSketch(sketch, settings);
