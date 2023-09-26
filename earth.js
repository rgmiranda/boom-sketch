const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `earth-2-${seed}`
};

const numLines = 24;
const radius = 450;
const lineWidth = 2 * radius / numLines;
const colors = createColormap({
  colormap: 'earth',
  nshades: numLines * 0.5,
}).reverse().concat(createColormap({
  colormap: 'earth',
  nshades: numLines * 0.5,
}));

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    let x, x0, x1, y;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    context.rotate(-Math.PI  * 0.07);
    context.lineCap = 'round';
    context.lineWidth = lineWidth;
    for (let i = 0; i < numLines; i++) {
      y = (i + 0.5) *  lineWidth - radius;
      x = Math.sqrt(radius * radius - y * y) - lineWidth * 0.5;
      x0 = -x;
      do {
        x1 = x0 + random.range(1, x * 1.6);
        if ( x1 > x - lineWidth - 1) {
          x1 = x;
        }
        context.beginPath();
        context.moveTo(x0, y);
        context.lineTo(x1, y);
        context.strokeStyle = random.pick(colors.slice(Math.max(i - 3, 0), Math.min(i + 3, colors.length - 1)));
        context.stroke();
        x0 = x1 + lineWidth;
      } while (x1 < x);
    }
  };
};

canvasSketch(sketch, settings);
