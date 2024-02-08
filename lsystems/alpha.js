const canvasSketch = require('canvas-sketch');
const { Alphabet } = require('./alphabet');
const { LSystem } = require('./lsystem');
const { Turtle } = require('./turtle');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'lsystem-alpha'
};
const turtleStep = -15;

const sketch = () => {
  const a = Math.PI * (1 / 12 );
  const genRules = {
    'F': 'FF+[+F-F-F]-[-F+F+F]',
  };
  const renderRules = {
    'F': (ctx) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, turtleStep);
      ctx.stroke();
      ctx.translate(0, turtleStep);
    },
    'G': (ctx) => {
      ctx.translate(0, turtleStep);
    },
    '+': (ctx) => {
      ctx.rotate(a);
    },
    '-': (ctx) => {
      ctx.rotate(-a);
    },
    '[': (ctx) => {
      ctx.save();
    },
    ']': (ctx) => {
      ctx.restore();
    },
  }
  const alphabet = new Alphabet('FG+-[]', genRules, renderRules);
  const lsystem = new LSystem('F', alphabet);
  return ({ context, width, height }) => {
    context.translate(width * 0.5, height);
    const turtle = new Turtle(context, width, height, alphabet);
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    for(let i = 0; i < 4; i++) {
      lsystem.generate();
    }
    turtle.render(lsystem.sentence);
  };
};

canvasSketch(sketch, settings);
