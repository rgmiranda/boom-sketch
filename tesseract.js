const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'teseracts'
};

const size = 108;
const pad = 40;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 * @param { number } size 
 * @param { number } prop 
 * @param { boolean } front 
 */
const drawTeseract = (context, x, y, size, prop, front) => {
  const fg = front ? 'gray' : 'white';
  const bg = front ? 'white' : 'gray';
  const hin = Math.sin(prop * Math.PI) * size * 0.1;
  const hout = Math.sin((1 - prop) * Math.PI) * size * 0.1;
  
  context.save();
  
  context.beginPath();
  context.moveTo(x - hin, y + hout);
  context.lineTo(x + size * prop, y - hin);
  context.lineTo(x + size * prop, y + size + hin);
  context.lineTo(x - hin, y + size - hout);
  context.closePath();

  context.fillStyle = bg;
  context.fill();
  
  context.beginPath();
  context.moveTo(x + size * prop, y - hin);
  context.lineTo(x + size + hin, y + hout);
  context.lineTo(x + size + hin, y + size - hout);
  context.lineTo(x + size * prop, y + size + hin);
  context.closePath();

  context.fillStyle = fg;
  context.fill();

  context.restore();
};

const sketch = ({ width, height }) => {
  /** @type { { x: number, y: number, size: number, prop: number, front: boolean }[] } */
  const teseracts = [];
  const cols = Math.ceil(width / size);
  const rows = Math.ceil(height / size);

  for (let j = 0; j < rows; j++) {
    const y = j * size + pad * 0.5;
    for (let i = 0; i < cols; i++) {
      const x = i * size + pad * 0.5;
      let front = true;
      let prop = (i + j * 2) * 0.1;
      while (prop > 1) {
        front = !front;
        prop -= 1;
      }
      teseracts.push({
        x,
        y,
        size: size - pad,
        prop,
        front,
      })
    }
  }

  return ({ context }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    for (let i = 0; i < teseracts.length; i++) {
      const t = teseracts[i];
      drawTeseract(context, t.x, t.y, t.size, t.prop, t.front);
      t.prop += 0.015;
      if (t.prop > 1) {
        t.prop -= 1;
        t.front = !t.front;
      }
    }

  };
};

canvasSketch(sketch, settings);
