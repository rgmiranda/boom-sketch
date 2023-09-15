const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `electrical-storm-${seed}`
};

const numFallers = 64;
const numSwitchs = 64;

const colors = createColormap({
  colormap: 'electric',
  nshades: numFallers,
});

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    const fallerPadding = width / numFallers;
    const switchPadding = height / numSwitchs;
    
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    context.strokeStyle = 'white';
    context.lineCap = 'round';
    
    for (let i = 0; i < numFallers; i++) {
      let x = (i + 0.5) * fallerPadding;
      let y = 0, nx, dir;

      context.lineWidth = random.rangeFloor(2, 10);
      context.strokeStyle = colors[i];
      context.beginPath();
      context.moveTo(x, y);
      for (let j = 1; j < numSwitchs + 1; j++) {
        y = j * switchPadding;
        if (x - fallerPadding < 0 || dir < 0) {
          nx = random.pick([x, x + fallerPadding]);
        } else if (x + fallerPadding > width || dir > 0) {
          nx = random.pick([x - fallerPadding, x]);
        } else {
          nx = random.pick([x - fallerPadding, x, x + fallerPadding]);
        }
        context.lineTo(nx, y);
        dir = x - nx;
        x = nx;
      }
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
