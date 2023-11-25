const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const eases = require('eases');
const { Vector } = require('p5');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'twist'
};

const colors = createColormap({
  colormap: 'hsv',
  nshades: 256
})

const switchSpan = 50;
const margin = 50;
const easing = eases.quadInOut;

const sketch = ({width, height}) => {
  const points = [ 
    new Vector(margin, 0),
    new Vector(width - margin, 0),
    new Vector(width - margin, height),
    new Vector(margin, height)
  ];
  const directions = [
    1,
    1,
    -1,
    -1
  ];
  let idx1 = 0;
  let idx2 = 3;
  let age = 0;
  let cidx = 0;
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = colors[cidx];
    cidx = (cidx + 1) % colors.length;

    if ( age > switchSpan ) {
      directions[idx1] *= -1;
      directions[idx2] *= -1;
      idx1 = (idx1 + 2) % points.length;
      idx2 = (idx2 + 2) % points.length;
      age = 0;
    }

    points[idx1].y = directions[idx1] > 0
      ? easing(age / switchSpan) * height
      : height - easing(age / switchSpan) * height;

    points[idx2].y = directions[idx2] > 0
      ? easing(age / switchSpan) * height
      : height - easing(age / switchSpan) * height;

    context.beginPath();
    context.moveTo(margin, height * 0.5);
    context.bezierCurveTo(points[0].x, points[0].y, points[1].x, points[1].y, width - margin, height * 0.5);
    context.bezierCurveTo(points[2].x, points[2].y, points[3].x, points[3].y, margin, height * 0.5);
    context.lineWidth = 20;
    context.stroke();

    age++;
  };
};

canvasSketch(sketch, settings);
