const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');
const createColormap = require('colormap');
const eases = require('eases');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `firegrid-${seed}`
};

const colors = createColormap({
    nshades: 32,
    colormap: 'magma'
});

const cols = 32;
const rows = 32;

const sketch = ({ width, height }) => {
    const pw = width / cols;
    const ph = height / rows;
    
    return ({ context, width, height }) => {
        random.setSeed(seed);
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);

        for(let j = 0; j < rows; j++) {
            const y = ph * j;
            const mc = Math.floor(eases.circIn(j / rows) * colors.length);
            for(let i = 0; i < cols; i++) {
                const x = pw * i;
                const ic = math.clamp(Math.floor(random.gaussian(mc, colors.length / 6)), 0, colors.length - 1);
                const color = colors[ic];
                context.beginPath();
                context.roundRect(x, y, pw, ph, pw * 0.1);
                context.fillStyle = color;
                context.fill();
            }
        }
    };
};

canvasSketch(sketch, settings);
