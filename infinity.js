const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'infinity'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawSymbol = (context, width, height) => {
  const splits = 64;
  const angle = 2 * Math.PI / splits;
  const r0 = width * 0.34;
  const r1 = width * 0.14;
  const cx0 = width * 0.7 - r0;
  const cx1 = width * 0.7 + r1;
  const cy = height * 0.5;
  context.lineWidth = 2;

  let a0 = - Math.PI * 0.25;
  let a1 = Math.PI * 0.25;

  context.beginPath();
  for (let i = 0; i < splits; i++) {
    const x0 = r0 * Math.cos(a0); 
    const y0 = r0 * Math.sin(a0); 
    const x1 = r1 * Math.cos(a1); 
    const y1 = r1 * Math.sin(a1);

    if (i === 0) {
      context.moveTo(cx0 + x0, cy + y0);
    } else {
      context.lineTo(cx0 + x0, cy + y0);
    }
    context.lineTo(cx1 + x1, cy + y1);
    a0 += angle;
    a1 -= angle;
  }
  context.closePath();
  context.stroke();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawSymbol(context, width, height);
  };
};

canvasSketch(sketch, settings);
