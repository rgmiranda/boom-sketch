const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'spiral-waves',
};
const numBuoys = 1024;
const amp = 50;
const freq = 0.01;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { { x: number, y: number, d: number }[] } buoys 
 * @param { number } frame 
 */
const drawBuoys = (ctx, buoys, frame) => {
  buoys.forEach(({x, y, d}) => {
    const ox = Math.cos((d - frame) * freq) * amp;
    const oy = Math.sin((d - frame) * freq) * amp;

    ctx.beginPath();
    ctx.arc(x + ox, y + oy, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  });
};

const sketch = ({ width, height }) => {
  const cx = width * 0.5;
  const cy = height * 0.5;

  const buoys = Array(numBuoys).fill(false).map(() => {
    const x = random.rangeFloor(0, width);
    const y = random.rangeFloor(0, height);
    const d = Math.sqrt((cx - x) * (cx - x) + (cy - y) * (cy - y));
    return { x, y, d };
  });

  return ({ context, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawBuoys(context, buoys, frame * 10);
  };
};

canvasSketch(sketch, settings);
