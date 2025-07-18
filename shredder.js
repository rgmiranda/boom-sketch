const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'shredder',
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } height 
 * @param { number[] } lines 
 */
const drawLines = (context, height, lines) => {
  lines.forEach(x => {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  })
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } height 
 * @param { number } xStart 
 * @param { number } xEnd 
 */
const drawPoints = (context, height, xStart, xEnd) => {
  const numPoints = 1024 * 512;
  for (let i = 0; i < numPoints; i++) {
    const x = random.range(xStart - 1, xEnd + 1);
    const y = height - Math.abs(random.gaussian(0, 1)) * height * 0.15;
    const r = random.range(0.5, 1);
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fill();
  }
};

const sketch = ({ width, height }) => {
  const numLines = 256;
  const lines = Array(numLines).fill(0).map(() => random.range(width * 0.1, width * 0.9));
  return ({ context }) => {
    random.setSeed(1312);
    context.strokeStyle = 'white';
    context.fillStyle = 'black';
    context.lineWidth = 2;
    context.fillRect(0, 0, width, height);
    drawLines(context, width, lines);
    drawPoints(context, height, Math.min(...lines), Math.max(...lines));
  };
};

canvasSketch(sketch, settings);
