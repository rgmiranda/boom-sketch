const canvasSketch = require('canvas-sketch');
const { StormBackground } = require('./background');

const cvWidth = 1080, cvHeight = 1080;

/** @type { StormBackground } */
let bg;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};


const sketch = ({width, height}) => {
  bg = new StormBackground(width, height, 'images/sprites/rain-tile.png');
  return ({ context, width, height }) => {
    context.fillStyle = '#222';
    context.fillRect(0, 0, width, height);
    bg.draw(context);
    bg.update();
  };
};

canvasSketch(sketch, settings);
