const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const pixelHeight = 5;
const pixelWidth = 60;
const bg = 'black';
let cx, cy;

const colors = createColormap({
  colormap: 'copper',
  nshades: 64,
})

/**
 * 
 * @param { number } x 
 * @param { number } y 
 * @returns { number }
 */
const getOffset = (x, y) => {
  const ratio = 0.002;
  x -= cx;
  y -= cy;
  return random.noise2D(x, y, ratio, 0.5) + 0.5;
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 */
const drawPixel = (context, x, y) => {
  const offset = getOffset(x, y);
  const color = colors[Math.floor(offset * colors.length)];
  context.save();

  context.fillStyle = color;

  context.beginPath();
  context.moveTo(x, y + pixelHeight);
  context.lineTo(x + pixelWidth, y + pixelHeight);
  context.lineTo(x + pixelWidth * offset, y);
  context.closePath();
  context.fill();

  context.restore();
};

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `wrinkles-${seed}`
};

const sketch = () => {

  return ({ context, width, height }) => {
    random.setSeed(seed);
    cx = width * 0.5;
    cy = height * 0.5;
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);
    
    for (let y = 0; y < height; y += pixelHeight) {
      for (let x = 0; x < width; x += pixelWidth) {
        drawPixel(context, x, y);
      }
    }

  };
};

canvasSketch(sketch, settings);
