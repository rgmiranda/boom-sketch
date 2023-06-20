const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const seed = random.getRandomSeed();

random.setSeed(seed);

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `uneven-${seed}`,
};
const numColors = 8;
const rows = 8;
const cols = 8;
const margin = 8;
const strokes = 8;

const colors = Array(numColors).fill(0).map(() => random.pick(risoColors).hex);
const angles = [0, Math.PI * 0.5, Math.PI * 0.25, Math.PI * 0.75]

const tiles = Array(rows * cols).fill(0).map(() => ({
  angle: random.pick(angles),
  color: random.pick(colors),
}));

const sketch = ({width, height}) => {
  const pw = (width - margin) / cols - margin;
  const ph = (height - margin) / rows - margin;
  const strokePad = Math.min(pw, ph) / strokes;
  return ({ context, width, height }) => {
    context.fillStyle = '#F2EECB';
    context.fillRect(0, 0, width, height);
    context.lineWidth = 2;

    tiles.forEach((tile, i) => {
      const x = (i % cols) * (pw + margin);
      const y = Math.floor(i / cols) * (ph + margin);
      let ratio = 1;

      context.save();

      context.strokeStyle = tile.color;

      context.translate(x + margin + pw * 0.5, y + margin + ph * 0.5);
      if (tile.angle == Math.PI * 0.25 || tile.angle == Math.PI * 0.75) {
        context.beginPath();
        context.rect(-pw * 0.5, -ph * 0.5, pw, ph);
        context.clip();
        ratio = Math.SQRT2;
      }
      context.rotate(tile.angle);
      context.translate(-pw * 0.5 * ratio, -ph * 0.5 * ratio);
      for (let j = 0; j < strokes * ratio; j++) {
        context.beginPath();
        context.moveTo(0, j * strokePad + random.range(-strokePad * 0.2, strokePad * 0.2) + strokePad * 0.5);
        context.lineTo(pw * ratio, j * strokePad + random.range(-strokePad * 0.2, strokePad * 0.2) + strokePad * 0.5);
        if (random.chance(0.25)) {
          context.lineTo(0, j * strokePad + random.range(-strokePad * 0.2, strokePad * 0.2) + strokePad * 0.5);
        }
        context.stroke();
      }

      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
