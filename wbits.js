const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const risoColors = require('riso-colors');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `wbits-${Date.now()}`
};

const colors = [
  '#0c85f5',
  '#0dcbff',
  '#00e8dc',
  '#0dffae',
  '#0cf566',
];

const rows = cols = 32;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 * @param { number } w 
 * @param { number } h 
 */
const drawCell = (context, x, y, w, h) => {

  let pos, size;

  const pw = w / 3;
  const ph = h / 3;
  
  context.save();
  context.translate(x, y);
  
  pos = random.pick([0, 1, 2]);
  size = random.pick([1, 2, 3]);
  if ( size + pos > 3) {
    size -= pos;
  }
  
  for (let i = pos; i < pos + size; i++) {
    context.fillStyle = random.pick(colors);
    context.beginPath();
    context.arc(pw * 1.5, (i + 0.5) * ph, ph * 0.5, 0, Math.PI * 2);
    context.fill();
  }
  
  //context.fillRect(pw, ph * pos, pw, ph * size);
  
  pos = random.pick([0, 1, 2]);
  size = random.pick([0, 1, 2, 3]);
  if ( size + pos > 3) {
    size -= pos;
  }
  
  for (let i = pos; i < pos + size; i++) {
    context.fillStyle = random.pick(colors);
    context.beginPath();
    context.arc(pw * (i + 0.5), 1.5 * ph, ph * 0.5, 0, Math.PI * 2);
    context.fill();
  }
  //context.fillRect(pw * pos, ph, pw * size, ph);

  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black'; // '#F6EEE3';
    context.fillRect(0, 0, width, height);

    const pw = width / cols;
    const ph = height / rows;

    for (let i = 0; i < rows; i++) {
      y = ph * i;
      for (let j = 0; j < rows; j++) {
        x = pw * j;
        drawCell(context, x, y, pw, ph);
      }
    }
  };
};

canvasSketch(sketch, settings);
