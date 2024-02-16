const canvasSketch = require('canvas-sketch');
const { Alphabet } = require('./alphabet');
const { LSystem } = require('./lsystem');
const { Turtle } = require('./turtle');
const createColormap = require('colormap');

const depth = 3;
const settings = {
    dimensions: [1080, 1080],
    name: `penrose-${depth}`
};
const turtleStep = 1000;

const sketch = () => {
    const a = Math.PI * 0.5;
    let scale = 1;
    const genRules = {
        'F': 'DF-F+F+F-FU',
    };
    let cidx = 0;
    const renderRules = {
        'F': (ctx) => {
            ctx.beginPath();

            ctx.moveTo(0, 0);
            ctx.lineTo(turtleStep * scale, 0);
            ctx.strokeStyle = colors[cidx];
            ctx.stroke();
            ctx.translate(turtleStep * scale, 0);
            cidx++;
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
        '[': (ctx) => {
            ctx.save();
        },
        ']': (ctx) => {
            ctx.restore();
        },
    }
    const alphabet = new Alphabet('FDU+-[]', genRules, renderRules);
    const lsystem = new LSystem('F', alphabet);
    for (let i = 0; i < depth; i++) {
        lsystem.generate();
    }
    const numStrokes = lsystem.sentence.length - lsystem.sentence.replaceAll('F', '').length;
    const colors = createColormap({
        nshades: numStrokes,
        colormap: 'warm'
    }).reverse();
    return ({ context, width, height }) => {
        cidx = 0;
        context.lineWidth = (24 / depth) - 3;
        context.lineCap = 'round';
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
        context.translate((width - turtleStep) * 0.5, height * 0.8);
        
        const turtle = new Turtle(context, width, height, alphabet);
        turtle.render(lsystem.sentence);
        return;
    };
};

canvasSketch(sketch, settings);
