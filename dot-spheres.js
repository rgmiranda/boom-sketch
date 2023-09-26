const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const eases = require('eases');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `dot-spheres-${seed}`,
};
const dots = 4096;
const numSpheres = 32;

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = '#f6eee3';
    context.fillRect(0, 0, width, height);
    const spheres = Array(numSpheres).fill(0).map(() => {
      let [ x, y ] = random.insideCircle(width * 0.5);
      x += width * 0.5;
      y += height * 0.6;
      return {
        x,
        y,
        r: random.rangeFloor(200, 250),
      };
    }).sort((a, b) => a.y - b.y);
    
    spheres.forEach(s => {
      const { x, y, r } = s;
      context.fillStyle = '#f6eee3';
      context.beginPath();
      context.arc(x, y, r + 5, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = 'black';
      for( let i = 0; i < dots; i++) {
        const angle = random.gaussian(-Math.PI * 0.5, 1);
        const l = eases.circOut(random.value()) * r;
        const px = Math.cos(angle) * l;
        const py = Math.sin(angle) * l;
        context.beginPath();
        context.arc(x + px, y + py, random.range(0.5, 2), 0, Math.PI * 2);
        context.fill();
      }

    });
  };
};

canvasSketch(sketch, settings);
