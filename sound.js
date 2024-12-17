const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const seed = random.getRandomSeed();
random.setSeed(seed);

const ratio = 10 * Math.PI / 1080;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `sound-${seed}`
};

const waveOffsets = Array(16).fill(0).map(() => random.range(-4, 4));

const colors = createColormap({
  colormap: 'spring',
  nshades: waveOffsets.length,
})

/**
 * 
 * @param { number } x 
 * @param { number } offset 
 */
const waveGenerator = (x, offset) => x > 0 ? offset * Math.sin(x - Math.PI * 0.5) + offset : offset * Math.sin(x + Math.PI * 0.5) + offset;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawWaves = (context, width, height) => {
  context.globalCompositeOperation = 'lighten';
  context.lineWidth = 5;
  waveOffsets.forEach((offset, i) => {
    context.strokeStyle = colors[i];
    let y;
    context.beginPath();
    for (let x = 0; x < width; x++) {
      let amp = Math.sin(mapRange(x, 0, width, 0, Math.PI, true)) * 1.75;
      y = amp * waveGenerator(x * ratio, offset) / ratio + height * 0.5;
      if (x === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.stroke();
  });
};

const sketch = () => {
  return ({ context, width, height }) => {
    drawWaves(context, width, height);
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
