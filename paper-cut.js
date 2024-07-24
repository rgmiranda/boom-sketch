const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'paper-cut',
  fps: 12
};

const freq = 0.001;
const amp = 200;
const pixelSize = 50;

const colors = createColormap({
  colormap: 'copper',
  nshades: 9,
});

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
  ctx.beginPath();
  ctx.moveTo(0, height);
  let o;
  for(let x = 0; x < width + pixelSize; x += pixelSize) {
    o = Math.round(random.noise3D(x, y * 2, frame *5, freq, amp) / pixelSize) * pixelSize;
    ctx.lineTo(x, y + o);
  }
  ctx.lineTo(width, height);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 70;
  ctx.fill();
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = colors[0];
    context.fillRect(0, 0, width, height);
    const wavePad = height / (colors.length + 2);
    colors.forEach((c, i) => fillWave(context, (i + 1) * wavePad, width, height, c, frame * 5));
  };
};

canvasSketch(sketch, settings);
