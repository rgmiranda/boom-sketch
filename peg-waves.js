const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `peg-wave-${seed}`,
};

const freq = 0.0025;
const amp = 200;
const pixelSize = 10;
/*
const colors = createColormap({
  colormap: 'bone',
  nshades: 9,
});*/

const colors = ['#0b132b', '#1c2541', '#3a506b', '#5bc0be', '#6fffe9'];

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } y 
 * @param { number } width 
 * @param { number } height 
 * @param { string } color 
 * @param { number } frame 
 */
const fillWave = (ctx, y, width, height, color, frame) => {
  /** @type { HTMLCanvasElement } */
  const cv = document.createElement('canvas');
  cv.width = width;
  cv.height = height;
  /** @type { CanvasRenderingContext2D } */
  const context = cv.getContext('2d');

  context.fillStyle = color;
  let ho;
  for(let x = -pixelSize; x < width + pixelSize; x += pixelSize) {
    ho = Math.round(random.noise3D(x, y * 5, frame, freq, amp) / pixelSize) * pixelSize;
    for (let yi = y + ho; yi < height + pixelSize; yi += pixelSize) {
      context.beginPath();
      context.arc(x + pixelSize * 0.5, yi + pixelSize * 0.5, pixelSize * 0.5, 0, Math.PI * 2);
      context.fill();
    } 
  }
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 20;
  ctx.drawImage(cv, 0, 0);
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    const wavePad = Math.round(height / (pixelSize * (colors.length + 2))) * pixelSize;
    colors.forEach((c, i) => fillWave(context, (i + 1) * wavePad, width, height, c, frame * 5));
  };
};

canvasSketch(sketch, settings);
