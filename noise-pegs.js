const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const risoColors = require('riso-colors');
const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `noise-pegs-${seed}`,
};

const cols = 15;
const rows = 15;
const amp = 0.5;
const freq = 0.2;

//const colors = [ '#012a4a', '#013a63', '#01497c', '#014f86', '#2a6f97', '#2c7da0', '#468faf', '#61a5c2', '#89c2d9', '#a9d6e5']
//const colors = [ '#00a6fb', '#0582ca', '#006494', '#003554', '#051923' ];
//const colors = ['#89c2d9', '#2a6f97', '#012a4a'];
const colors = [
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
];

const sketch = ({ width, height }) => {
  const pw = width / cols;
  const ph = height / rows;
  const pegs = [];


  for (let i = 0; i < rows; i++) {
    const y = i * ph + ph * 0.5;
    for (let j = 0; j < cols; j++) {
      const x = j * pw + pw * 0.5;
      const color = colors[Math.floor((random.noise2D(i, j, freq, amp) + amp) * colors.length)];
      pegs.push({ x, y, color });
    }
  }
  return ({ context }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    pegs.forEach(p => {
      context.beginPath();
      context.arc(p.x, p.y, pw * 0.35, 0, Math.PI * 2);
      context.fillStyle = p.color;
      context.fill();
    })
  };
};

canvasSketch(sketch, settings);
