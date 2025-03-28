const canvasSketch = require('canvas-sketch');
const { random, color } = require('canvas-sketch-util');
const createColormap = require('colormap');
const seed = random.getRandomSeed();
const freq = 0.01;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `stalactite-${seed}`,
};

const colors = createColormap({
  nshades: 12,
  colormap: 'bone',
})

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } height 
 * @param { number } radius 
 * @param { number } step 
 * @param { string } color 
 */
const drawStrip = (context, x, height, radius, step, color) => {
  let y = radius;
  while (y < height + radius && radius > 0.5) {
    const ox = random.range(-radius * 0.25, radius * 0.25);
    context.fillStyle = color;
    context.beginPath();
    context.arc(x + ox, y, radius, 0, Math.PI * 2);
    context.fill();
    y += radius + random.range(radius * 0.25, radius * 0.5);
    radius *= step;
    y += radius;
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    let x = 0;
    while (x < width) {
      const radius = random.range(8, 12);
      //const step = random.range(0.08, 0.2);
      const step = random.range(0.95, 0.98);
      x += radius;
      drawStrip(context, x, height, radius, step, random.pick(colors));
      x += radius;
    }
  };
};

canvasSketch(sketch, settings);
