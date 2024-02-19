const canvasSketch = require('canvas-sketch');
const { Turtle } = require('./turtle');
const { LSystem } = require('./lsystem');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `quebracho-${Date.now()}`
};

const sketch = ({ context }) => {

  const angle = Math.PI / 6 ;
  const scale = 0.5;
  const strokeSize = 185;
  const strokeWeight = 32;
  const treeSystem = new LSystem('L', [
    //'F => FD[F][+F][-F]U',
    'L => FD[F-L+L][+L+FL][--FL+L-L]U',
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
