const canvasSketch = require('canvas-sketch');
const { Alphabet } = require('./alphabet');
const { LSystem } = require('./lsystem');
const { Turtle } = require('./turtle');

const settings = {
    dimensions: [1080, 1080],
    name: 'lsystem-sierpinsky'
};
const turtleStep = 1000;

const sketch = () => {
    const a = Math.PI / 3;
    let scale = 1;
    const genRules = {
        'F': 'D-G+F+G-U',
        'G': 'D+F-G-F+U',
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
            scale *= 0.5;
        },
        'U': (ctx) => {
            scale *= 2;
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
    return ({ context, width, height }) => {
        context.lineWidth = 2;
        context.strokeStyle = 'white';
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
        const turtle = new Turtle(context, width, height, alphabet);
        context.translate((width - turtleStep) * 0.5, height * 0.5 + turtleStep * Math.sqrt(3) * 0.25);
        for (let i = 0; i < 8; i++) {
            lsystem.generate();
        }
        turtle.render(lsystem.sentence);
    };
};

canvasSketch(sketch, settings);
