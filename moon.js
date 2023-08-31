const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `summer-day-${seed}`
};

const sky = [
  '#f7b267', '#f79d65', '#f4845f', '#f27059', '#f25c54'
  //'#3a015c', '#4f0147', '#35012c', '#290025', '#11001c', '#000000', '#000000'
];

const sun = [
  '#ff4800', '#ff5400', '#ff6000', '#ff6d00', '#ff7900', '#ff8500', '#ff9100', '#ff9e00', '#ffaa00', '#ffb600'
  //'#aaaaaa', '#bbbbbb', '#cccccc', '#dddddd', '#eeeeee'
];

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.translate(width * 0.5, height * 0.5);
    let angle = 0, step, color, radius = width * 0.25;
    while (angle < Math.PI * 2) {
      step = random.range(0.01, 0.03);
      if (angle + step > Math.PI * 2) {
        step = Math.PI * 2 - angle;
      }
      context.beginPath();
      context.moveTo(0, 0);
      context.arc(0, 0, width, angle, angle + step);
      color = random.pick(sky);
      context.fillStyle = color;
      context.strokeStyle = color;
      context.stroke();
      context.fill();
      angle += step;
    }
    while (radius > 0) {
      step = random.range(2, 5);
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      color = random.pick(sun);
      context.fillStyle = color;
      context.fill();
      radius -= step;
    }
  };
};

canvasSketch(sketch, settings);
