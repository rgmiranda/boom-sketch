const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');

const seed = random.getRandomSeed();
random.setSeed(seed);
const size = 1080;
const minRadius = size * 0.18;
const maxRadius = size * 0.48;
const numLines = 512;
const settings = {
  dimensions: [ size, size ],
  name: `eye-${seed}`
};
const colors = [
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex
];


/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width
 * @param { number } height
 */
function drawEye(context, width, height) {
  let angle;
  let switches;
  let x, px;
  for (let i = 0; i < numLines; i++) {
    angle = random.range(0, Math.PI * 2);
    switches = Array(random.rangeFloor(10, 30)).fill(0).map( () => random.rangeFloor(minRadius, maxRadius - 10)).sort();
    //switches = [(minRadius + maxRadius) * 0.5]
    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.strokeStyle = random.pick(colors);
    context.rotate(angle);
    context.beginPath();
    x = 0;
    context.moveTo(x, minRadius);

    for (const y of switches) {
      px = x;
      x = random.rangeFloor(-10, 10);
      context.lineTo(px, y);
      context.bezierCurveTo(px, y + 10, x, y, x, y + 10);
    }

    context.lineTo(x, maxRadius);
    context.stroke();
    context.restore();
  }
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawEye(context, width, height);
  };
};

canvasSketch(sketch, settings);
