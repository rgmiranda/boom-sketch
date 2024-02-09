const canvasSketch = require('canvas-sketch');
const { Alphabet } = require('./alphabet');
const { LSystem } = require('./lsystem');
const { Turtle } = require('./turtle');

const settings = {
    dimensions: [1080, 1080],
    name: 'gosper',
};
const turtleStep = 900;

const sketch = () => {
    const a = Math.PI / 3;
    const sqrt7 = Math.sqrt(7);
    let scale = 1;
    const genRules = {
        'F': 'DF+G++G-F--FF-G+U',
        'G': 'D-F+GG++G+F--F-GU',
    };
    const renderRules = {
        'F': (ctx) => {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(turtleStep * scale, 0);
            ctx.stroke();
            ctx.translate(turtleStep * scale, 0);
        },
        'G': (ctx) => {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(turtleStep * scale, 0);
            ctx.stroke();
            ctx.translate(turtleStep * scale, 0);
        },
        'D': (ctx) => {
            scale /= sqrt7;
        },
        'U': (ctx) => {
            scale *= sqrt7;
        },
        '+': (ctx) => {
            ctx.rotate(a);
        },
        '-': (ctx) => {
            ctx.rotate(-a);
        },
    }
    const alphabet = new Alphabet('FGDU+-', genRules, renderRules);
    const lsystem = new LSystem('F', alphabet);
    for (let i = 0; i < 5; i++) {
        lsystem.generate();
    }
    return ({ context, width, height }) => {
        context.lineWidth = 2;
        context.strokeStyle = 'white';
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
        const turtle = new Turtle(context, width, height, alphabet);
        context.translate(width * 0.78, height * 0.1);
        turtle.render(lsystem.sentence);
    };
};

canvasSketch(sketch, settings);
