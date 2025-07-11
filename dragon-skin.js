const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'dragon-skin'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawScales = (context, width, height) => {
  const sh = 300;
  const sw = 220;
  const pad = 15;
  const m = sh / sw;
  const strokes = 12;
  let y = -sh * 0.5;
  let offset = true;
  while ( y < height ) {
    let x = offset ? -0.5 * sw : 0;
    while ( x < width ) {
      for (let i = 0; i < strokes; i++) {
        const cpad = i * pad;
        const ypad = cpad / m;
        const xpad = ypad / m;
        context.beginPath();
        context.moveTo(x + pad + xpad, y + sh * 0.5 - ypad);
        context.lineTo(x + sw - pad - xpad, y + sh * 0.5 - ypad);
        context.lineTo(x + sw * 0.5, y + sh - pad - cpad * m);
        context.closePath();
        context.fillStyle = 'white';
        context.fill();
  
        context.beginPath();
        context.moveTo(x + pad + xpad, y + sh * 0.5 - ypad);
        context.lineTo(x + sw - pad - xpad, y + sh * 0.5 - ypad);
        context.lineTo(x + sw * 0.5, y + sh - 1.15 * pad - pad * (strokes - i) / strokes - cpad * m);
        context.closePath();
        context.fillStyle = 'black';
        context.strokeStyle = 'black';
        context.fill();
        context.stroke();
      }
      x += sw;
    }
    offset = !offset;
    y += sh * 0.5;
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawScales(context, width, height);
  };
};

canvasSketch(sketch, settings);
