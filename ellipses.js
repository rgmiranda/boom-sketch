const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ],
  name: 'ellipses'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawEllipses = (context, width, height) => {
  const ellipses = 24;
  const orx = width * Math.SQRT1_2;
  const ory = height * 0.015;
  const drx = width * 0.015;
  const dry = height * Math.SQRT1_2;
  const sx = (drx - orx) / ellipses;
  const sy = (dry - ory) / ellipses;
  const cx = width * 0.5;
  const cy = height * 0.5;
  context.lineWidth = 4;

  for (let i = 0; i <= ellipses; i++) {
    const rx = orx + i * sx;
    const ry = ory + i * sy;
    context.beginPath();
    context.ellipse(cx, cy, rx, ry, Math.PI * 0.25, 0, Math.PI * 2);
    context.stroke();
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawEllipses(context, width, height);
  };
};

canvasSketch(sketch, settings);
