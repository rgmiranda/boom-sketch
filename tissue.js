const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');

const seed = random.getRandomSeed();
random.setSeed(seed);
const settings = {
  dimensions: [ 1080, 1080 ],
  name: `tissue-${seed}`
};
const maxRadius = 200;
const minRadius = 50;
const circlePadding = 5;
const levels = 12;
const colors = createColormap({
  colormap: 'bone',
  alpha: 1,
  nshades: levels,
  format: 'hex'
});
const numCircles = 16;

/**
 * 
 * @param { number } x 
 * @param { number } y 
 * @param { { x: number, y: number, r: number }[] } circles 
 * @returns 
 */
function getMaxRadius(x, y, circles) {
  if (circles.length === 0) {
    return maxRadius;
  }
  let max = circles.reduce((acc, c) => { 
    let d = Math.sqrt((c.x - x) * (c.x - x) + (c.y - y) * (c.y - y));
    console.log('ACC', acc, d);
    return Math.min(acc, d - c.r - circlePadding);
   }, maxRadius);
   console.log('MAX', max);
  return max;
}

const sketch = () => {
  return ({ context, width, height }) => {
    const circles = [];
    let x, y, r;
    for (let i = 0; i < numCircles; i++) {
      do {
        x =  random.rangeFloor(0, width);
        y = random.rangeFloor(0, height);
        r = getMaxRadius(x, y, circles);
      } while (r < 0);
      console.log('RAD', r);
      circles.push({ x, y, r});
    }
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'black';
    circles.forEach(c => {
      context.beginPath();
      context.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      context.fill();
    });

  };
};

canvasSketch(sketch, settings);
