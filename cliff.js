const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'cliff'
};

const colors = createColormap({
  colormap: 'bone',
  nshades: 16,
});

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawCliff = (context, width, height) => {
  const r = width * 0.48;
  const cx = width * 0.5;
  const cy = height * 0.5;

  const anglePad = Math.PI / colors.length;
  colors.forEach((c, i) => {
    context.fillStyle = c;
    const angle = (i + 1) * anglePad - Math.PI * 0.5;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;

    context.beginPath();
    context.moveTo(0, height);
    context.lineTo(0, cy + y);
    context.lineTo(cx - x, cy + y);
    context.lineTo(cx, cy + r);
    context.lineTo(cx + x, cy + y);
    context.lineTo(width, cy + y);
    context.lineTo(width, height);
    context.closePath();
    context.fill();
  });
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawCliff(context, width, height);
  };
};

canvasSketch(sketch, settings);
