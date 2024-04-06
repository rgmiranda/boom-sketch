const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `ripples-${seed}`
};

const minRadius = 170;
const maxRadius = 1080 * 0.6;
const lineWidth = 2;
const arcLength = 5;

const colors = createColormap({
  nshades: Math.ceil((maxRadius - minRadius) / lineWidth),
  colormap: 'copper',
}).reverse();

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } radius 
 * @param { number } lineWidth 
 */
const drawArcs = (ctx, radius, lineWidth) => {
  let angle = random.noise1D(radius, 0.02, Math.PI * 0.4);
  const angleSize = random.range(0, Math.PI * 0.25) + Math.PI * 0.25;
  const numArcs = Math.ceil(angleSize * radius / arcLength)
  const subangle = angleSize / numArcs;
  angle -= angleSize * 0.5;
  
  for (let i = 0; i < numArcs; i++) {
    ctx.lineWidth = math.lerp(lineWidth, 0.1, Math.abs(i - numArcs * 0.5) / (numArcs * 0.5));
    ctx.beginPath();
    ctx.arc(0, 0, radius, angle, angle + subangle);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, radius, angle + Math.PI, angle + Math.PI + subangle);
    ctx.stroke();
    angle += subangle;
  }
  
};

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    let radius = minRadius;

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    context.translate(width * 0.5, height * 0.5);
    
    let i = 0;
    while (radius <= maxRadius) {
      context.strokeStyle = colors[i];
      drawArcs(context, radius, lineWidth);    
      
      radius += lineWidth;
      i++;
    }
  };
};

canvasSketch(sketch, settings);
