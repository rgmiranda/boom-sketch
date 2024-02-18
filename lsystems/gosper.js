const canvasSketch = require('canvas-sketch');
const { LSystem } = require('./lsystem');
const { Turtle } = require('./turtle');

const settings = {
    dimensions: [1080, 1080],
    name: 'gosper',
};
const turtleStep = 900;

const sketch = ({ context }) => {
    const angle = Math.PI / 3;
    const scale = 1 / Math.sqrt(7);
    const genRules = [
        'F => DF+G++G-F--FF-G+U',
        'G => D-F+GG++G+F--F-GU',
    ];
    const lsystem = new LSystem('F', genRules);
    lsystem.generate(5);
    const turtle = new Turtle(context, turtleStep, 150, angle, scale);
    return ({ context, width, height }) => {
        context.strokeStyle = 'white';
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
        turtle.init(width * 0.78, height * 0.1, 0);
        turtle.render(lsystem.sentence);
    };
};

canvasSketch(sketch, settings);
