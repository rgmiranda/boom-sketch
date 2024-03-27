const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'circle-checker'
};
const numChecks = 64;

const colors = createColormap({
  colormap: 'plasma',
  nshades: 32
})

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } checks 
 * @param { number } radius 
 */
const drawChecker = (ctx, checks, radius) => {
  const angle = 2 * Math.PI / checks;
  ctx.save();
  ctx.globalCompositeOperation = 'xor';
  ctx.fillStyle = 'black';
  for (let i = 0; i < checks; i++) {
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.arc(0, 0, radius, angle * i, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    context.rotate(Math.PI * 0.5);
    drawChecker(context, numChecks, width * 0.48);
    context.rotate(Math.PI * 0.5);
    drawChecker(context, numChecks, width * 0.48);

    /**
     * @type { CanvasGradient }
     */
    const gradient = context.createLinearGradient(-width * 0.5, -height * 0.5, width * 0.5, height * 0.5);
    colors.forEach((c, i) => {
      gradient.addColorStop(i / (colors.length - 1), c);
    });

    context.globalCompositeOperation = 'source-in';
    context.fillStyle = gradient;
    context.fillRect(-width * 0.5, -height * 0.5, width, height);


    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'black';
    context.translate(-width * 0.5, -height * 0.5);
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
