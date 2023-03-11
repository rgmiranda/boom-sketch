const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const eases = require('eases');

const seed = random.getRandomSeed();
random.setSeed(seed);

const cvWidth = cvHeight = 1080
const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name: `dotmoon-${seed}`
};
const bg = 'black';
const fg = 'white';
const dots = 200000;

const sketch = ({width, height}) => {
  const maxRadius = Math.min(width, height) * 0.48;

  return ({ context, width, height }) => {
    let x, y, radius, angle;
    const cx = width * 0.25;
    const cy = height * 0.5;
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = fg;

    for (let i = 0; i < dots; i++) {
      angle = random.range(0, Math.PI) - Math.PI * 0.5;
      radius = eases.quadOut(eases.circOut(random.value())) * maxRadius;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      context.beginPath();
      context.arc(cx + x, cy + y, 0.5, 0, Math.PI * 2);
      context.stroke();
    }

    context.beginPath();
    context.arc(- width * 0.25, cy, width * 0.49 * Math.SQRT2, -Math.PI * 0.25, Math.PI * 0.25);
    context.closePath();
    context.fill();
    
  };
};

canvasSketch(sketch, settings);
