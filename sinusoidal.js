const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'sinusoidal',
  animate: true,
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } frame 
 */
const drawWave = (context, width, height, frame) => {
  const points = 24;

  const from = 0;
  const to = width;
  const mx = from + (to - from) * 0.5;
  const amp = height * 0.1;
  const step = (to - from) / points;
  const offset = ( 7 * frame ) % step;
  context.strokeStyle = 'white';
  context.lineCap = 'square';

  for (let i = 0; i <= points; i++) {
    const x = from + i * step + offset;
    const y = height * 0.5 + Math.sin(2 *  Math.PI * (x - from) / (to - from)) * amp;
    const lineWidth = math.mapRange(mx - Math.abs(x - mx), 0, (to - from) * 0.5, 0.5, 15, true);
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(width * 0.5 + ( i - points * 0.5 ), 0);
    context.lineTo(x, y);
    context.lineTo(width * 0.5 + ( i - points * 0.5 ), height);
    context.stroke();

  }
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawWave(context, width, height, frame);
  };
};

canvasSketch(sketch, settings);
