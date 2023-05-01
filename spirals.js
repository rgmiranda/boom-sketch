const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const seed = random.getRandomSeed();

random.setSeed(seed);

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `spirals-${seed}`
};
const spiralCount = 128;
const colors = [
  '#012A4A',
  '#013A63',
  '#01497C',
  '#014F86',
  '#2A6F97',
  '#2C7DA0',
  '#468FAF',
  '#61A5C2',
  '#89C2D9',
  '#A9D6E5',
];

/**
 * 
 * @param { CanvasRenderingContext2D } context
 */
function drawSpiral(context, x, y, maxRadius, circles) {

  let angle, radius, offset;
  const radiusPadding = maxRadius / circles;
  context.save();
  context.translate(x, y);
  context.rotate(random.range(0, Math.PI * 2));
  context.beginPath();
  for (let i = 0; i < circles; i++) {
    radius = (i + 1) * radiusPadding;
    angle = Math.PI / (2 * radius);
    if (i  === circles - 1) {
      offset = 0;
    } else {
      offset = radiusPadding / (4 * radius);
    }
    for (let j = 0; j < 4 * radius; j++) {
      context.rotate(angle);
      context.arc(0, 0, radius + offset * j, 0, angle);
    }
  }
  context.fillStyle = random.pick(colors);
  context.fill();
  context.stroke();
  context.restore();
}

const sketch = ({width, height}) => {
  const spirals = [];
  for (let i = 0; i < spiralCount; i++) {
    spirals.push({
      x: random.rangeFloor(0, width),
      y: random.range(0, height),
      radius: random.rangeFloor(100, 200),
      circles: random.rangeFloor(8, 10)
    })
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    for (let i = 0; i < spiralCount; i++) {
      drawSpiral(
        context,
        spirals[i].x,
        spirals[i].y,
        spirals[i].radius,
        spirals[i].circles
      );
    }
  };
};

canvasSketch(sketch, settings);
