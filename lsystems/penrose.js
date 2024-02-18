const canvasSketch = require('canvas-sketch');
const { LSystem } = require('./lsystem');
const { Turtle } = require('./turtle');

const depth = 4;
const settings = {
    dimensions: [1080, 1080],
    name: `penrose-${depth}`
};
const turtleStep = 1000;

const sketch = ({ context }) => {
    const angle = Math.PI * 0.5;
    const scale = 1 / 3;
    const genRules = [
        'F => DF-F+F+F-FU',
    ];
    const lsystem = new LSystem('F', genRules);
    lsystem.generate(depth);
    const turtle = new Turtle(context, turtleStep, 3 ** depth * 2, angle, scale);
    return ({ context, width, height }) => {
        cidx = 0;
        context.lineWidth = (24 / depth) - 3;
        context.lineCap = 'round';
        context.strokeStyle = 'white';
        context.fillRect(0, 0, width, height);
        
        turtle.init((width - turtleStep) * 0.5, height * 0.8, 0);
        
        turtle.render(lsystem.sentence);
    };
};

canvasSketch(sketch, settings);
