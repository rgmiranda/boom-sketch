const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `noncentric-${seed}`,
  animate: true,
};
const radius = 400;
const offsetRadius = 100;
const colors = [
  '#04e762',
  '#f5b700',
  '#dc0073',
  '#008bf8',
  '#6610f2',
];
const circles = [];

const sketch = () => {
  random.shuffle(colors).forEach(c =>  {
    circles.push({
      offset: random.rangeFloor(-20, 20),
      scale: random.range(0.05, 0.1),
      color: c
    })
  });
  return ({ context, width, height, frame }) => {
    let ox, oy;

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);

    context.globalCompositeOperation = "screen";
    
    circles.forEach(c => {
      ox = Math.cos((c.offset + frame) * c.scale) * offsetRadius;
      oy = Math.sin((c.offset + frame) * c.scale) * offsetRadius;
      context.beginPath();
      context.arc(ox, oy, radius, 0, Math.PI * 2);
      context.fillStyle = c.color;
      context.fill();
    });
    context.globalCompositeOperation = "source-over";
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fillStyle = 'black';
    context.fill();

  };
};

canvasSketch(sketch, settings);
