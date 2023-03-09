const canvasSketch = require('canvas-sketch');
const paper = require('paper');

const cvWidth = cvHeight = 1080;
const bg = 'black';
const fg = 'white';

const settings = {
  dimensions: [cvWidth, cvHeight]
};

const sketch = async ({ canvas, width, height }) => {

  paper.setup(canvas);

  return () => {
    const rectangle = new paper.Rectangle([0, 0], [width, height]);
    const rectPath = new paper.Path.Rectangle(rectangle);
    rectPath.sendToBack();
    rectPath.fillColor = bg;

    var path = new paper.Path();
    path.strokeColor = fg;
    var start = new paper.Point(100, 100);
    path.moveTo(start);
    path.lineTo(start.add([200, -50]));
    paper.view.draw();
  };
};

canvasSketch(sketch, settings);
