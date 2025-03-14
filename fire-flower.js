const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'growth',
  animate: true,
  name: 'fire-flower'
};

const step = 10;
const speed = 4;
const freq = 0.04;
const numPetals = 48;
const petalAngle = 2 * Math.PI / numPetals;

const colors = createColormap({
  nshades: 16,
  colormap: 'inferno',
}).reverse();

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } frame 
*/
const drawFlower = (context, width, height, frame) => {
  context.save();
  context.translate(width * 0.5, height * 0.5);

  const grad = context.createRadialGradient(0, 0, 0, 0, 0, width * 0.48);
  colors.forEach((c, i, a) => grad.addColorStop(i / a.length, c));
  context.strokeStyle = grad;

  let oposite = false;
  for (let i = 0; i < numPetals; i++) {
    drawPetal(context, width, height, frame, oposite);
    context.rotate(petalAngle);
    oposite = !oposite;
  }
  context.restore();
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } frame 
 * @param { boolean } oposite  
*/
const drawPetal = (context, width, height, frame, oposite) => {
  const radius = Math.min(width, height) * 0.48;
  context.beginPath();
  context.moveTo(0, 0);
  let pfreq = freq;
  for (let x = 0; x < radius; x += step) {
    const amp = Math.PI * x / numPetals;
    const y = (oposite ? -1 : 1 ) * Math.sin((x - frame * speed) * pfreq) * amp;
    context.lineTo(x, y);
  }
  context.stroke();
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.lineWidth = 4;
    context.fillRect(0, 0, width, height);

    drawFlower(context, width, height, frame);
  };
};

canvasSketch(sketch, settings);
