const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');

const seed = random.getRandomSeed();
const numMembers = 64;
const memberWidth = 30;
const memberHeight = 250;
const radius = 250;
random.setSeed(seed);

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `follow-${seed}`,
};
const colors = createColormap({
  colormap: 'bone',
  nshades: 12,
}).reverse()

const sketch = ({ width, height, context }) => {
  const members = Array(numMembers).fill(0).map(() => {
    const [x, y] = random.insideCircle(radius);
    return { x, y };
  }).sort((a, b) => a.y - b.y);
  const gradient = context.createLinearGradient(0, -memberHeight * 0.5, 0, memberHeight * 0.5);
  colors.forEach((c, i) => {
    gradient.addColorStop(i / (colors.length - 1), c);
  })
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);

    context.shadowColor = 'black';
    context.shadowOffsetX = 2;
    context.shadowBlur = 25;

    members.forEach(member => {
      context.save();

      context.translate(member.x, member.y);
      context.fillStyle = gradient;
      context.fillRect(-memberWidth * 0.5, -memberHeight * 0.5, memberWidth, memberHeight);

      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
