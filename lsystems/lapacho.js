const canvasSketch = require('canvas-sketch');
const { Turtle } = require('./turtle');
const { math } = require('canvas-sketch-util');
const { LSystem } = require('./lsystem');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `lapacho-${Date.now()}`
};

const sketch = ({ context }) => {

  const angle = Math.PI * 0.1;
  const scale = 0.5;
  const strokeSize = 220;
  const strokeWeight = 28;
  const treeSystem = new LSystem('F', [
    'F => FD[++F-F+F][-F-FF]U'
  ]);
  treeSystem.generate(7);
  const turtle = new Turtle(context, strokeSize, strokeWeight, angle, scale);

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    turtle.init(width * 0.5, height, -Math.PI * 0.5);
    turtle.render(treeSystem.sentence);
  };
};

canvasSketch(sketch, settings);
