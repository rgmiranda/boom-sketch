const canvasSketch = require('canvas-sketch');
const { Alphabet } = require('./alphabet');
const { LSystem } = require('./lsystem');
const { Turtle } = require('./turtle');

const settings = {
    dimensions: [1080, 1080],
    name: 'koch-island'
};
const turtleStep = 600;

const sketch = () => {
    const a = Math.PI * 0.5;
    let scale = 1;
    const genRules = {
        'F': 'GF+F-F-FF+F+F-FH',
    };
    const renderRules = {
        'F': (ctx) => {
            ctx.lineTo(0, turtleStep * scale);
            ctx.translate(0, turtleStep * scale);
        },
        'G': (ctx) => {
            scale *= 0.25;
        },
        'H': (ctx) => {
            scale *= 4;
        },
        '+': (ctx) => {
            ctx.rotate(a);
        },
        '-': (ctx) => {
            ctx.rotate(-a);
        },
    }
    const alphabet = new Alphabet('FGH+-', genRules, renderRules);
    const lsystem = new LSystem('F-F-F-F', alphabet);
    for (let i = 0; i < 4; i++) {
        lsystem.generate();
    }
    return ({ context, width, height }) => {
        context.fillRect(0, 0, width, height);
        context.fillStyle = 'black';
        context.translate((width - turtleStep) * 0.5, (height - turtleStep) * 0.5);
        context.strokeStyle = 'white';
        context.lineWidth = 1;
        const turtle = new Turtle(context, width, height, alphabet);

        context .beginPath();
        turtle.render(lsystem.sentence);
        context.fillStyle = 'black';
        context.shadowColor = 'white';
        context.shadowBlur= 20;
        context.fill();
    };
};

canvasSketch(sketch, settings);
