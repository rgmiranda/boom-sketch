const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `dot-rain-${seed}`
};
const numDots = 64;
const cols = 64;
const rows = 64;

const sketch = ({ width, height }) => {
  random.setSeed(seed);
  const xr = width / cols;
  const yr = height / rows;
  const dots = Array(numDots).fill(0).map(() => {
    return {
      x: random.rangeFloor(0, 1.1 * width / xr) * xr + xr * 0.5,
      y: random.rangeFloor(0, height / yr) * yr + yr * 0.5,
      size: 8,
    }
  }).sort((a, b ) => a.x - b.x);

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    dots.forEach(d => {
      let currentSize =  d.size;
      let yOffset = 0;
      do {
        context.beginPath();
        context.arc(d.x - yOffset, d.y, currentSize, 0, Math.PI * 2);
        context.fillStyle = 'black';
        context.fill();
        currentSize -= 0.25;
        yOffset += d.size * 2;
      } while (currentSize >= 1);
    });
  };
};

canvasSketch(sketch, settings);
