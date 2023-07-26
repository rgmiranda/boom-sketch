const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const seed = random.getRandomSeed();

random.setSeed(seed);

const cvHeight = 1080;
const cvWidth = 1080;
const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name: `uneven-circles-${seed}`,
};
const numColors = 16;
const numCircles = 4;
const circleRadius = [100, 450];
const strokePadding = 6;

const colors = Array(numColors).fill(0).map(() => random.pick(risoColors).hex);

const circles = Array(numCircles).fill(0).map(() => ({
  x: random.rangeFloor(0, cvWidth),
  y: random.rangeFloor(0, cvHeight),
  radius: random.rangeFloor(...circleRadius),
  color: random.pick(colors),
  angle: random.chance(0.5) ? 0 : Math.PI * 0.5,
}));

console.log(circles, colors);

const sketch = ({width, height}) => {
  return ({ context, width, height }) => {
    context.fillStyle = '#F2EECB';
    context.fillRect(0, 0, width, height);
    context.lineWidth = 2;

    circles.forEach((tile, i) => {
      let x;
      context.save();

      context.strokeStyle = tile.color;
      context.translate(tile.x, tile.y);
      context.rotate(tile.angle);
      for (let y = -tile.radius + strokePadding * 0.5; y <= tile.radius; y += strokePadding) {
        x = Math.sqrt(tile.radius * tile.radius - y * y);
        context.beginPath();
        context.moveTo(-x + random.rangeFloor(-strokePadding * 0.5, strokePadding * 0.5), y + random.rangeFloor(-strokePadding * 0.5, strokePadding * 0.5));
        context.lineTo(x + random.rangeFloor(-strokePadding * 0.5, strokePadding * 0.5), y + random.rangeFloor(-strokePadding * 0.5, strokePadding * 0.5));
        if (random.chance(0.25)) {
          context.lineTo(-x + random.rangeFloor(-strokePadding * 0.5, strokePadding * 0.5), y + random.rangeFloor(-strokePadding * 0.5, strokePadding * 0.5));
        }
        context.stroke();
      }

      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
