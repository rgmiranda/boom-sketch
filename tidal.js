const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true,
  name: 'tidal'
};

const pixelSize = 32;
const padding = 300;
const amp = 150;
const freq = 0.1;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } cols 
 * @param { number } rows 
 * @param { number } pixelSize 
 * @param { number[][] } offsets 
 * @param { number } frame 
 */
const drawPoints = (context, cols, rows, pixelSize, offsets, frame) => {
  context.fillStyle = 'white';
  for (let j = 0; j < rows; j++) {
    const y = j * pixelSize;
    for (let i = 0; i < cols; i++) {
      const x = i * pixelSize;
      context.beginPath();
      context.arc(x, y + offsets[j][i] + Math.sin((j * 2.5 - i * 1 - frame) * freq) * amp, pixelSize * 0.25, 0, Math.PI * 2);
      context.fill();
    }
  }
};

const sketch = ({ width, height }) => {
  const w = width - 2 * padding;
  const h = height - 2 * padding;
  const cols = Math.ceil(w / pixelSize);
  const rows = Math.ceil(h / pixelSize);
  /** @type { number[][] } */
  const offsets = Array(rows).fill(false).map((_, j) => Array(cols).fill(false).map((_, i) => random.noise2D(j, i, freq, amp)));
  return ({ context, frame }) => {

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(padding, padding);
    drawPoints(context, cols, rows, pixelSize, offsets, frame);
  };
};

canvasSketch(sketch, settings);
