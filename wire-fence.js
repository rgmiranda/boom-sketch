const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'wire-fence'
};

const freq = 0.01;
const step = 5;
const pixelSize = 80;

/** @type { number[] } */
const parts = [];
for (let j = 0; j < pixelSize + step; j += step) {
  parts.push(0.5 * Math.sin( 2 * Math.PI * j / pixelSize - Math.PI * 0.5) + 0.5)
}

/** @type { {x: number, y: number, dist: number}[] } */
const pixels = [];


/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 * @param { number } dist 
 * @param { number } frame 
 */
const drawSine = (context, x, y, dist, frame) => {
  const amp = Math.sin((dist - frame * 5) * freq) * pixelSize * 0.5;

  context.strokeStyle = 'white';
  context.lineWidth = 2;
  context.save();
  context.translate(x, y);
  
  context.beginPath();
  parts.forEach((ox, i) => {
    if (i === 0) {
      context.moveTo(ox * amp, i * step);
    } else {
      context.lineTo(ox * amp, i * step);
    }
  });
  context.stroke();

  context.beginPath();
  parts.forEach((ox, i) => {
    if (i === 0) {
      context.moveTo(-ox * amp, i * step);
    } else {
      context.lineTo(-ox * amp, i * step);
    }
  });
  context.stroke();

  context.restore();
};

const sketch = ({ width, height }) => {

  const cx = width * 0.5;
  const cy = height * 0.5;
  let offset = false;

  for (let x = 0; x < width + pixelSize; x += pixelSize * 0.5) {
    const dx = cx - x;
    for (let y = offset ? -pixelSize * 0.5 : 0; y < width + pixelSize; y += pixelSize) {
      const dy = cy - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      pixels.push({ x, y, dist });
    }
    offset = !offset;
  }

  return ({ context, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    pixels.forEach(({x, y, dist}) => {
      drawSine(context, x, y, dist, frame);
    });
  };
};

canvasSketch(sketch, settings);
