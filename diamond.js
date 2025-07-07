const { range } = require('@rgsoft/math');
const canvasSketch = require('canvas-sketch');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'diamond',
  animate: true,
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } amp 
 */
const drawDiamond = (context, width, height, amp) => {
  const r = width * 0.48;
  const cx = width * 0.5;
  const cy = height * 0.5;
  const xp = Math.sqrt(3) * 0.5 * amp;
  const yp = 0.5;
  context.save();
  context.translate(cx, cy);
  context.beginPath();
  context.moveTo(0, -r);
  context.lineTo(xp * r, -yp * r);
  context.lineTo(xp * r, yp * r);
  context.lineTo(0, r);
  context.lineTo(-xp * r, yp * r);
  context.lineTo(-xp * r, -yp * r);
  context.closePath();
  context.stroke();
  context.restore();
};

const sketch = () => {
  const angles = range(0, Math.PI * 0.51, Math.PI * 0.125);
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.fillRect(0, 0, width, height);
    angles.forEach((a, i) => {
      drawDiamond(context, width, height, eases.quadOut(Math.abs(Math.cos(a))));
      angles[i] += 0.0125;
    })
  };
};

canvasSketch(sketch, settings);
