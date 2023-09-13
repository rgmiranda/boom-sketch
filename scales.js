const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'scales-jet'
};

const numStripes = 128;
const numScales = 12;


const colors = createColormap({
  colormap: 'jet',
  nshades: numScales * 2 + 2,
});

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 */
const drawScale = (context, x, y, scaleRadius) => {
  context.save();

  context.translate(x, y);
  let angle, amp, radius, dx, dy, cx, cy;

  context.lineWidth = 0.1;
  for (let i = 0; i < numStripes; i++) {
    radius = eases.circOut(random.value()) * scaleRadius * Math.SQRT2;
    amp = eases.circIn(radius / (scaleRadius * Math.SQRT2)) * Math.PI * 0.25;
    angle = random.range(-Math.PI * 0.5 - amp, -Math.PI * 0.5 + amp);

    dx = Math.cos(angle) * radius;
    dy = Math.sin(angle) * radius;
    cx = 0;
    cy = -radius * 0.55;

    context.beginPath();
    context.moveTo(0, 0);
    context.quadraticCurveTo(cx, cy, dx, dy);
    context.stroke();

  }
  context.lineWidth = 2;
  context.beginPath();
  context.arc(-scaleRadius, 0, scaleRadius, -Math.PI * 0.5, 0);
  context.stroke();

  context.beginPath();
  context.arc(scaleRadius, 0, scaleRadius, Math.PI, Math.PI * 1.5);
  context.stroke();

  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    //context.fillStyle = '#eeeedd';
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    const scaleRadius = width / (2 * numScales);
    let x, y;
    
    for (let i = 0; i < numScales * 2 + 2; i++) {
      context.strokeStyle = colors[i];
      y = scaleRadius * i;
      for (let j = 0; j < numScales + 1; j++) {
        x = (i % 2 === 0) ? j * scaleRadius * 2 : (j + 0.5) * scaleRadius * 2;
        drawScale(context, x, y, scaleRadius);
      }
    }

  };
};

canvasSketch(sketch, settings);
