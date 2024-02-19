const canvasSketch = require('canvas-sketch');
const { Turtle } = require('./turtle');
const { LSystem } = require('./lsystem');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `pine-${Date.now()}`
};

const sketch = ({ context }) => {

  const angle = Math.PI / 6 ;
  const scale = 0.5;
  const strokeSize = 200;
  const strokeWeight = 12;
  const treeSystem = new LSystem('L', [
    'L => FD[FL+L-L][+L][-L][++L++L][---L-L]U',
  ]);
  treeSystem.generate(6);
  const turtle = new Turtle(context, strokeSize, strokeWeight, angle, scale);

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    turtle.init(width * 0.55, height, -Math.PI * 0.5);
    turtle.render(treeSystem.sentence);
  };
};

canvasSketch(sketch, settings);
