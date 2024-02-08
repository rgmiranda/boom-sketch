const canvasSketch = require('canvas-sketch');
const { Alphabet } = require('./alphabet');
const { LSystem } = require('./lsystem');
const { Turtle } = require('./turtle');

const settings = {
    dimensions: [1080, 1080],
    name: 'lsystem-pythagoras'
};
const turtleStep = 180;

const sketch = () => {
    const a = Math.PI * 0.25;
    let scale = 1;
    const genRules = {
        'F': 'F[D+FU][D-FU]',
    };
    const renderRules = {
        'F': (ctx) => {
            ctx.beginPath();
            ctx.strokeStyle = 'white'
            ctx.rect(-turtleStep * 0.5 * scale, -turtleStep * scale, turtleStep * scale, turtleStep * scale);
            ctx.stroke();
            ctx.translate(0, -turtleStep * scale);
        },
        'D': (ctx) => {
            scale *= Math.SQRT1_2;
        },
        'U': (ctx) => {
            scale *= 2 / Math.SQRT2;
        },
        '+': (ctx) => {
            ctx.rotate(a);
            ctx.translate(0, -turtleStep * 0.5 * scale);
        },
        '-': (ctx) => {
            ctx.rotate(-a);
            ctx.translate(0, -turtleStep * 0.5 * scale);
        },
        '[': (ctx) => {
            ctx.save();
        },
        ']': (ctx) => {
            ctx.restore();
        },
    }
    const alphabet = new Alphabet('FDU+-[]', genRules, renderRules);
    const lsystem = new LSystem('F', alphabet);
    return ({ context, width, height }) => {
        context.lineWidth = 3;
        const turtle = new Turtle(context, width, height, alphabet);
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
        context.translate(width * 0.5, height);
        for (let i = 0; i < 10; i++) {
            lsystem.generate();
        }
        turtle.render(lsystem.sentence);
    };
};

canvasSketch(sketch, settings);
