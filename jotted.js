const canvasSketch = require('canvas-sketch');
const { math, random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `jotted-${seed}`
};

const numStrokes = 6;

const pad = 80;

const colors = createColormap({
  nshades: numStrokes * 4,
  colormap: 'rainbow-soft',
});

let pox = 0;
let poy = 0;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } width 
 * @param { number } height 
 * @param { number } i 
 */
const drawStroke = (ctx, width, height, i) => {
  const ph = height / (numStrokes);
  const pw = width / (numStrokes);
  const ci = math.clamp(i, 0.25, numStrokes * 2 - 0.35);
  const ni = math.clamp(i + 1, 0.25, numStrokes * 2 - 0.35);

  const ox = random.range(-pad * 0.35, pad * 0.35);
  const oy = random.range(-pad * 0.35, pad * 0.35);
  
  ctx.beginPath();
  if (ci > numStrokes) {
    ctx.moveTo((ci % numStrokes) * pw + ox, height + oy);
    ctx.lineTo(width + pox, (ci % numStrokes) * ph + poy);
  } else {
    ctx.moveTo(0 + ox, ci * ph + oy);
    ctx.lineTo(ci * pw + pox, 0 + poy);
  }
  ctx.strokeStyle = colors[i * 2];
  ctx.stroke();

  pox = random.range(-pad * 0.35, pad * 0.35);
  poy = random.range(-pad * 0.35, pad * 0.35);
  
  ctx.beginPath();
  if (ci > numStrokes) {
    ctx.moveTo((ci % numStrokes) * pw + ox, height + oy);
    ctx.lineTo(width + pox, (ni % numStrokes) * ph + poy);
  } else {
    ctx.moveTo(0 + ox, ci * ph + oy);
    if (ni > numStrokes) {
      ctx.lineTo(width + pox, (ni % numStrokes) * ph + poy);
    } else {
      ctx.lineTo(ni * pw + pox, 0 + poy);
    }
  }
  ctx.strokeStyle = colors[i * 2 + 1];
  ctx.stroke();
  
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    context.save();
    context.lineWidth = pad * 0.75;
    context.lineCap = 'round';
    context.translate(pad, pad);
    context.globalCompositeOperation = 'overlay';
    //context.filter = 'blur(2px)'
    for (let i = 0; i < numStrokes * 2; i++) {
      drawStroke(context, width - 2 * pad, height - 2 * pad, i);
    }
    context.restore();

    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
