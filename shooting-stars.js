const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `shooting-stars-${seed}`
};

const numStars = 128;
const angle = - Math.PI * 0.5;

const colors = createColormap({
  colormap: 'hot',
  nshades: 12
}).reverse();

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const bx = Math.cos(angle);
    const by = Math.sin(angle);
    const bpx = Math.cos(angle - Math.PI * 0.5);
    const bpy = Math.sin(angle - Math.PI * 0.5);

    for (let i = 0; i < numStars; i++) {
      const x = random.range(0, width);
      const y = random.range(0, height + 200);
      const l = random.range(500, 1000);
      const s = random.range(1, 4);

      context.save();
      context.translate(x, y);
      context.rotate(0.2)
      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, l);
      colors.forEach((e, j) => gradient.addColorStop(j / (colors.length - 1), e));  
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, s, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.moveTo(bpx * s, bpy * s);
      context.lineTo(l * bx, l * by);
      context.lineTo(-bpx * s, -bpy * s);
      context.closePath();
      context.fill();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
