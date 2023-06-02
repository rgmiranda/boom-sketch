const canvasSketch = require('canvas-sketch');
const { Flask } = require('./flask');

const settings = {
  dimensions: [ 1080, 1080 ]
};
const cols = 10;
const rows = 10;

const sketch = ({ width, height }) => {
  const flask = new Flask(width, height, cols, rows);
  flask.addDimmer();
  flask.addMonomer();
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    flask.draw(context);
  };
};

canvasSketch(sketch, settings);
