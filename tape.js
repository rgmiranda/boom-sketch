const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `tape-${seed}`,
};

const colors = createColormap({
  colormap: 'bone',
  nshades: 12
}).reverse();

const strokePad = 7;


/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } y 
 */
const drawTape = (context, width, height, y) => {
  const radii = [];
  const start = random.rangeFloor(-20, -60);
  let totalWidth = 0;
  context.lineWidth= 6;
  const dir = random.boolean();
  while (totalWidth + start < width) {
    const r = random.rangeFloor(20, 100);
    totalWidth += r;
    radii.push(r);
  }

  colors.forEach(c => {
    let x = start;
    let up = dir;
    context.beginPath();
    context.moveTo(x, y);
    radii.forEach(r => {
      if (up) {
        context.arc(x + r, y, r, Math.PI, Math.PI * 2);
      } else {
        context.arc(x + r, y, r, Math.PI, 0, true);
      }
      x += r * 2;
      up = !up;
    });
    context.strokeStyle = c;
    context.fillStyle = 'black';
    context.stroke();
    context.lineTo(width, 0);
    context.lineTo(0, 0);
    context.closePath();
    context.fill();
    y -= strokePad;
  });
};

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawTape(context, width, height, 1000);
    drawTape(context, width, height, 820);
    drawTape(context, width, height, 640);
    drawTape(context, width, height, 460);
    drawTape(context, width, height, 280);
    drawTape(context, width, height, 100);  
  };
};

canvasSketch(sketch, settings);
