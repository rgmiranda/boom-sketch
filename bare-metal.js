const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'bare-metal'
};

/*const colors = createColormap({
  nshades: 11,
  colormap: 'picnic'
});*/

const colors = createColormap({
  nshades: 9,
  colormap: 'bone'
}).concat(createColormap({
  nshades: 9,
  colormap: 'greys'
}).reverse());

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawParts = (context, width, height) => {
  const parts = 5;
  const minRadius = width * 0.1;
  const maxRadius = width * 0.48;
  const cx = width * 0.5;
  const cy = height * 0.5;

  const ph = height / (2 * parts - 1);
  const xpad = (maxRadius - minRadius) / parts;
  context.shadowColor = 'black';
  context.shadowOffsetY = 10;
  context.shadowBlur = 10;
  for (let i = 0; i < parts; i++) {
    const r = i * xpad + minRadius;
    const y0 = (parts - i - 1) * ph;
    const grad = context.createLinearGradient(cx - r, y0, cx + r, y0);
    grad.addColorStop(0, 'black');
    colors.forEach((c, i, a) => grad.addColorStop((i + 1) / (a.length + 1), c));
    grad.addColorStop(1, 'black');
    context.fillStyle = grad;
    context.shadowOffsetY = 10;
    context.fillRect(cx - r, y0, r * 2, ph);
    if (i !== 0) {
      const y1 = cy + (i - 0.5) * ph;
      context.shadowOffsetY = -10;
      context.fillRect(cx - r, y1, r * 2, ph);
    }
  }
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawParts(context, width, height);
  };
};

canvasSketch(sketch, settings);
