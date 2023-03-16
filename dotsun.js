const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const seed = random.getRandomSeed();
random.setSeed(seed);

const cvWidth = cvHeight = 1080
const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name: `dots-${seed}`
};
const bg = 'black';
const fg = 'white';
const dots = 200000;

const sketch = ({width, height}) => {
  const maxRadius = Math.min(width, height) * 0.48;
  const minRadius = Math.min(width, height) * 0.3;

  return ({ context, width, height }) => {
    let x, y, radius, angle;
    const cx = width * 0.5;
    const cy = height * 0.5;
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = fg;

    for (let i = 0; i < dots; i++) {
      angle = random.range(0, Math.PI * 2);
      radius = Math.abs(random.gaussian(0, 0.125)) * maxRadius + minRadius;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      context.beginPath();
      context.arc(cx + x, cy + y, 0.5, 0, Math.PI * 2);
      context.stroke();
    }
    
  };
};

canvasSketch(sketch, settings);
