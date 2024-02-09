const canvasSketch = require('canvas-sketch');
const { Alphabet } = require('./alphabet');
const { LSystem } = require('./lsystem');
const { Turtle } = require('./turtle');

const settings = {
    dimensions: [1080, 1080],
    name: 'hexaflake'
};
const turtleStep = 500;

const sketch = () => {
    const a = Math.PI / 3;
    const sqrt32 = Math.sqrt(3) * 0.5;
    let scale = 1;
    const genRules = {
        'F': 'F*D*F+F+F+F+F+F+/U[TD*F+F+F+F+F+F+/U]/',
    };
    const renderRules = {
        'F': (ctx) => {
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.moveTo(-turtleStep * scale / 6, -turtleStep * sqrt32 * scale);
            ctx.lineTo(turtleStep * scale / 6, -turtleStep * sqrt32 * scale);
            ctx.lineTo(-turtleStep * scale / 6, -turtleStep * sqrt32 * scale / 3);
            ctx.lineTo(turtleStep * scale / 6, -turtleStep * sqrt32 * scale / 3);
            ctx.closePath();
            ctx.fill();
        },
        'T': (ctx) => {
            ctx.translate(0, -2 * turtleStep * scale / 3);
        },
        'D': (ctx) => {
            scale /= 3;
        },
        'U': (ctx) => {
            scale *= 3;
        },
        '+': (ctx) => {
            ctx.rotate(a);
        },
        '-': (ctx) => {
            ctx.rotate(-a);
        },
        '*': (ctx) => {
            ctx.rotate(a * 0.5);
        },
        '/': (ctx) => {
            ctx.rotate(-a * 0.5);
        },
        '[': (ctx) => {
            ctx.save();
        },
        ']': (ctx) => {
            ctx.restore();
        },
    }
    const alphabet = new Alphabet('FDU+-*/[]', genRules, renderRules);
    const lsystem = new LSystem('*F+F+F+F+F+F+/', alphabet);
    for (let i = 0; i < 3; i++) {
        lsystem.generate();
    }
    return ({ context, width, height }) => {
        context.lineWidth = 3;
        const turtle = new Turtle(context, width, height, alphabet);
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
        context.translate(width * 0.5, height * 0.5);

        context.beginPath();
        context.moveTo(0, -turtleStep);
        context.lineTo(turtleStep * sqrt32, -turtleStep * 0.5);
        context.lineTo(turtleStep * sqrt32, turtleStep * 0.5);
        context.lineTo(0, turtleStep);
        context.lineTo(-turtleStep * sqrt32, turtleStep * 0.5);
        context.lineTo(-turtleStep * sqrt32, -turtleStep * 0.5);
        context.closePath();
        context.fillStyle = 'white';
        context.fill();  
        turtle.render(lsystem.sentence);
        return;
    };
};

canvasSketch(sketch, settings);
