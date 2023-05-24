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
const layers = 2;
/*const colors = createColormap({
  colormap: 'bone',
  alpha: 1,
  nshades: layers,
  format: 'hex'
});*/
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
    return Math.min(acc, d - c.r - circlePadding);
   }, maxRadius);
  return max;
}

/**
 * 
 * @param { string } color 
 * @param { number } width 
 * @param { number } height 
 * @returns { ImageData }
 */
function drawLayer(color, width, height) {
  /** @type { HTMLCanvasElement } */
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  /** @type { CanvasRenderingContext2D } */
  const context = canvas.getContext('2d');

  context.fillStyle = color;
  context.fillRect(0, 0, width, height);

  const circles = [];
  let x, y, r;
  for (let i = 0; i < numCircles; i++) {
    do {
      x = random.rangeFloor(0, width);
      y = random.rangeFloor(0, height);
      r = getMaxRadius(x, y, circles);
    } while (r < 0);
    circles.push({ x, y, r });
  }
  context.globalCompositeOperation = 'destination-out';
  context.fillStyle = '#FFFFFF00';
  circles.forEach(c => {
    context.beginPath();
    context.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    context.fill();
  });
  return context.getImageData(0, 0, width, height);
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    const layerData = drawLayer('blue', width, height);
    context.putImageData(layerData, 0, 0);
  };
};

canvasSketch(sketch, settings);
