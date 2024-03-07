const canvasSketch = require('canvas-sketch');
const { LSystem } = require('./lsystem');
const { Turtle } = require('./turtle');

const depth = 3;
const settings = {
    dimensions: [1080, 1080],
    name: `hilbert-${depth}`
};

const sketch = ({ context, width }) => {
    const turtleStep = width * (0.5 ** depth);
    const angle = Math.PI * 0.5;
    const scale = 1;
    const genRules = [
       'A => +BF-AFA-FB+',
       'B => -AF+BFB+FA-',
    ];
    const lsystem = new LSystem('A', genRules);
    lsystem.generate(depth);
    const turtle = new Turtle(context, turtleStep, 2, angle, scale);
    return ({ context, width, height }) => {
        cidx = 0;
        context.lineWidth = (24 / depth) - 3;
        context.lineCap = 'round';
        context.strokeStyle = 'white';
        context.fillRect(0, 0, width, height);
        
        turtle.init((turtleStep * 0.5), turtleStep * 0.5, 0);
        
        turtle.render(lsystem.sentence);
    };
};

canvasSketch(sketch, settings);
