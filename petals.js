const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `petals-${seed}`,
};

const colors = [
  '#cc5803',
  '#e2711d',
  '#ff9505',
  '#ffb627',
  '#ffc971',
  '#ffea00',
];

const numPetals = 180;
const innerRadius = 100;
const outerRadius = 480;
const petalAngle = 2 * Math.PI / numPetals;
const petals = Array(numPetals).fill(0).map(() => ({
  tip: {
    x: random.range(-5, 5),
    y: random.range(-5, 5),
  },
  cp1: {
    x: random.range(-20, 20),
    y: random.range(-20, 20),
  },
  cp2: {
    x: random.range(-20, 20),
    y: random.range(-20, 20),
  },
  point: {
    x: random.range(-30, 30),
    y: random.range(-30, 30),
  },
  color: random.pick(colors),
}))

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);

    context.lineWidth = 2;

    for (let i = 0; i < numPetals; i++) {
      const petal = petals[i];
      context.rotate(petalAngle);
      context.beginPath();
      context.moveTo(petal.tip.x, petal.tip.y + innerRadius);
      context.quadraticCurveTo(-50 + petal.cp1.x, (outerRadius + innerRadius) * 0.5 + petal.cp1.y, petal.point.x, outerRadius + petal.point.y);
      context.quadraticCurveTo(50 + petal.cp2.x, (outerRadius + innerRadius) * 0.5 + petal.cp2.x, petal.tip.x, petal.tip.y + innerRadius);
      context.strokeStyle = petal.color;
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
