const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'napkin'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } frame 
 */
const drawNapkin = (context, width, height, frame) => {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const pad = width * 0.15;
  const cols = 12;
  const cw = (width - pad * 2) / cols;
  const ch = (height - pad * 2) / cols;
  const xpad = cw * 0.1;
  const ypad = ch * 0.1;
  context.translate(cx, cy);
  
  for (let j = 0; j < cols; j++) {
    const y = pad + ch * j - cy;
    for (let i = 0; i < cols; i++) {
      const x = pad + cw * i - cx;
      const r = ((cx - x) * (cx - x) + (cy - y) * (cy - y)) / (cx * cx + cy * cy);
      const angle = Math.cos((r + frame * 0.1) * 0.75) * 0.5;
      context.save();
      context.rotate(angle);
      context.fillRect(x + xpad, y + ypad, cw - xpad * 2, ch - ypad * 2);
      context.restore();
    }
  }
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'white';
    drawNapkin(context, width, height, frame);
  };
};

canvasSketch(sketch, settings);
