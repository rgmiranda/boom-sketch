const canvasSketch = require('canvas-sketch');
const { LSystem } = require('./lsystem');
const { Turtle } = require('./turtle');

const settings = {
    dimensions: [1080, 1080],
    name: 'lsystem-sierpinsky'
};
const turtleStep = 1000;

const sketch = ({ context }) => {
    const angle = Math.PI / 3;
    let scale = 0.5;
    const genRules = [
      'F => D-G+F+G-U',
      'G => D+F-G-F+U',
    ];
    const lsystem = new LSystem('F', genRules);
    lsystem.generate(8);
    const turtle = new Turtle(context, turtleStep, 256, angle, scale);
    return ({ context, width, height }) => {
        context.strokeStyle = 'white';
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);

        turtle.init((width - turtleStep) * 0.5, height * 0.5 + turtleStep * Math.sqrt(3) * 0.25, 0);
        turtle.render(lsystem.sentence);
    };
};

canvasSketch(sketch, settings);
