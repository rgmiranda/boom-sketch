const canvasSketch = require('canvas-sketch');
const { mapRange, clamp } = require('canvas-sketch-util/math');
const { getRandomSeed, setSeed, rangeFloor, insideCircle } = require('canvas-sketch-util/random');
const createColormap = require('colormap');

const strokes = 200;
const slope = 0.125;
const moons = 3;
const colormap = 'plasma';
const nshades = 64;
const seed = getRandomSeed();
const colors = createColormap({
  colormap,
  nshades,
  alpha: 1,
  format: 'hex',
});

setSeed(seed);

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `planet-${colormap}-${seed}`
};


const sketch = () => {
  return ({ context, width, height }) => {
    let x, y, size, color, idx;
    const radius = width * 0.4;

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    context.beginPath();
    context.arc(width * 0.5, height * 0.5, radius, 0, Math.PI * 2);
    context.closePath();
    context.clip();
    context.lineCap = 'round';
    for (let i = 0; i < strokes; i++) {
      x = rangeFloor(0, width);
      y = rangeFloor(0, height);
      size = rangeFloor(0, width * 0.5);
      idx = Math.floor(mapRange(y, 0, height, 0, nshades - 1, true));
      idx = clamp(rangeFloor(idx - 10, idx + 10), 0, nshades - 1);
      context.lineWidth = rangeFloor(4, 10);

      color = colors[idx];

      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(x - size * 0.5, y - size * 0.5 * slope);
      context.lineTo(x + size * 0.5, y + size * 0.5 * slope);
      context.stroke();
    }

    for (let i = 0; i < moons; i++) {
      ([x, y] = insideCircle(radius));
      size = rangeFloor(50, 100);
      context.beginPath();
      context.arc(x + width * 0.5, y + height * 0.5, size, 0, Math.PI * 2);
      context.closePath();
      context.fill();
    }
  };

};

canvasSketch(sketch, settings);
