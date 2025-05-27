const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'diabolo',
  animate: true,
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } frame 
 */
const drawSqueeze = (context, width, height, frame) => {
  const lines = 24;
  const pad = width / lines;
  const cpy = height * 0.5;
  const cpx = width * 0.5;

  for (let i = 0; i < lines + 1; i++) {
    const x = pad * i + (frame % pad);
    const radius = math.mapRange(Math.abs(x - cpx), 0, cpx, 500, 200);
    const lineWidth = math.mapRange(Math.abs(x - cpx), 0, cpx, 5, 0.5);
    context.beginPath();
    context.moveTo(x, 0);
    context.arcTo(cpx, cpy, x, height, radius);
    context.lineTo(x, height);
    context.lineWidth = lineWidth;
    context.stroke();
  }
};

const sketch = () => {
  let frame = 0;
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawSqueeze(context, width, height, frame);
    frame += 5;
  };
};

canvasSketch(sketch, settings);
