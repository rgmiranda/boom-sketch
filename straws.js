const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `straws-${Date.now()}`
};

const colors = createColormap({
  colormap: 'par',
  nshades: 24
});

const numBridges = 8;
const bg = 'black';

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } width 
 * @param { number } height 
 * @param { string } color 
 */
const drawBridges = (ctx, width, height, color) => {
  let x0, y0, x1, y1;
  for (let i = 0; i < numBridges; i++) {
    const rnd = random.value();
    if (rnd < 1/6) {
      x0 = random.range(0, width);
      y0 = -10;
      x1 = -10;
      y1 = random.range(0, height);
    } else if (rnd < 2/6) {
      x0 = random.range(0, width);
      y0 = -10;
      x1 = random.range(0, width);
      y1 = height + 10;
    } else if (rnd < 3/6) {
      x0 = random.range(0, width);
      y0 = -10;
      x1 = width + 10;
      y1 = random.range(0, height);
    } else if (rnd < 4/6) {
      x0 = width + 10;
      y0 = random.range(0, height);
      x1 = random.range(0, width);
      y1 = height + 10;
    } else if (rnd < 5/6) {
      x0 = width + 10;
      y0 = random.range(0, height);
      x1 = -10;
      y1 = random.range(0, height);
    } else {
      x0 = random.range(0, width);
      y0 = height + 10;
      x1 = -10;
      y1 = random.range(0, height);
    }
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);

    ctx.strokeStyle = bg;
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.stroke();
  }

};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    colors.forEach(c => drawBridges(context, width, height, c));
  };
};

canvasSketch(sketch, settings);
