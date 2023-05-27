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
const circlePadding = 10;
const layers = 5;
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
 * @returns { HTMLCanvasElement }
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
    } while (r < minRadius);
    circles.push({ x, y, r });
  }
  context.globalCompositeOperation = 'destination-out';
  circles.forEach(c => {
    context.beginPath();
    context.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    context.fill();
  });
  return canvas;
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    let layerImage;
    for (let i = 0; i < layers; i++) {
      context.fillStyle = 'black';
      context.globalAlpha = 0.2;
      context.fillRect(0, 0, width, height);
      layerImage = drawLayer('white', width, height);
      context.globalAlpha = 1;
      context.shadowOffsetX = 5;
      context.shadowOffsetY = 5;
      context.shadowColor = 'black';
      context.shadowBlur = 10;
      context.drawImage(layerImage, 0, 0);
    }
  };
};

canvasSketch(sketch, settings);
