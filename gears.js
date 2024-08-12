const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');
const createColormap = require('colormap');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1350 ],
  animate: true,
  name: 'gears'
};

const numDents = 32;

const colors = createColormap({
  colormap: 'plasma',
  nshades: 12,
});

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } y 
 * @param { number } size 
 * @param { number } width 
 * @param { string } color 
 * @param { number } frame 
 */
const drawGear = (ctx, y, size, width, color, frame) => {
  ctx.fillStyle = color;
  const dentPad = width / numDents;
  ctx.fillRect(dentPad, y, width - dentPad * 2, size);
  
  for (let x = (frame % dentPad); x < width; x += dentPad) {
    const lineWidth = eases.circOut(math.clamp(Math.abs(x - width * 0.5), 0, width * 0.5) / (width * 0.5)) * dentPad;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }
}

const sketch = ({ width, height }) => {
  const gearSize = height / colors.length;
  return ({ context, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    colors.forEach((c, i) => drawGear(context, i * gearSize, gearSize, width, c, frame * ((i % 2) === 0 ? -5 : 5)));
  };
};

canvasSketch(sketch, settings);
