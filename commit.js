const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `commit-${seed}`
};

const colors = createColormap({
  nshades: 12,
  colormap: 'greens',
})

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawAnalyzer = (context, width, height) => {
  const splits = 128;
  const angle = 2 * Math.PI / splits;
  const apad = angle * 0.1;
  const minRadius = width * 0.1;
  const maxRadius = width * 0.48;
  const radiusDist = maxRadius - minRadius;
  const midRadius = (maxRadius + minRadius) * 0.5 - minRadius;
  context.save();
  context.translate(width * 0.5, height * 0.5);
  let radius = minRadius;
  
  
  while (radius < maxRadius) {
    const perimeter = 2 * Math.PI * radius;
    const splitSize = perimeter / splits;
    const rpad = splitSize * 0.1;
    for (let i = 0; i < splits; i++) {
      context.rotate(angle);
      if (random.chance(Math.abs(radius - minRadius - midRadius) / midRadius)) {
        continue;
      }
      context.beginPath();
      context.arc(0, 0, radius + splitSize - rpad, apad, angle - apad);
      context.arc(0, 0, radius + rpad, angle - apad, apad, true);
      context.closePath();
      context.fillStyle = random.pick(colors);
      context.fill();
    }
    radius += splitSize;
  }

  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawAnalyzer(context, width, height);
  };
};

canvasSketch(sketch, settings);
