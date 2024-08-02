const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const eases = require('eases');
const seed = random.getRandomSeed();
const colormap = 'jet';

const settings = {
  dimensions: [ 1080, 1350 ],
  name: `trig-${colormap}-${seed}`
};

const cw = 50;
const ch = Math.sqrt(3) * 0.5 * cw;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } x 
 * @param { number } y 
 * @param { number } scale
 */
const drawTriangle = (ctx, x, y, scale) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, -ch * 0.5 * scale);
  ctx.lineTo(cw * 0.5 * scale, ch * 0.5 * scale);
  ctx.lineTo(-cw * 0.5 * scale, ch * 0.5 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } x 
 * @param { number } y 
 * @param { number } scale 
 */
const drawInverseTriangle = (ctx, x, y, scale) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI)
  ctx.beginPath();
  ctx.moveTo(0, -ch * 0.5 * scale);
  ctx.lineTo(cw * 0.5 * scale, ch * 0.5 * scale);
  ctx.lineTo(-cw * 0.5 * scale, ch * 0.5 * scale);
  ctx.closePath();
  ctx.strokeStyle = 'black';
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

const sketch = ({ width, height }) => {
  const cols = Math.ceil(width / cw);
  const rows = Math.floor(height / ch);
  const colors = createColormap({
    colormap,
    nshades: rows,
  });
  return ({ context }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.lineWidth = 4;
    for(let i = 0; i < rows; i++) {
      context.fillStyle = colors[i];
      const p =  eases.quadOut(i / (rows - 1));
      const y = (i + 0.5) * ch;
      for (let j = -1; j < cols; j++) {
        const offset = ((i % 2) === 0 ? 0.5 : 1);
        const x = (j + offset) * cw;
        if (!random.chance(p)) {
          drawTriangle(context, x, y, 1);
        }
        if (!random.chance(p)) {
          drawInverseTriangle(context, x + cw * 0.5, y, 1);
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
