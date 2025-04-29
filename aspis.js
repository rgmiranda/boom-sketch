const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'aspis',
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } heigth 
 * @param { number } radius 
 * @param { number } splits 
 */
const drawSplit = (context, width, heigth, radius, splits) => {
  const angle = 2 * Math.PI / splits;
  context.save();
  context.strokeStyle = 'white';
  context.fillStyle = 'black';
  context.lineWidth = math.mapRange(width * 0.5 - radius, 0, width * 0.5, 1, 20, true);

  context.translate(width * 0.5, heigth * 0.5);
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.beginPath();
  for (let i = 0; i < splits; i++) {
    const x = Math.cos(Math.PI * 0.5 + angle * i) * radius;
    const y = Math.sin(Math.PI * 0.5 + angle * i) * radius;
    context.moveTo(0, 0);
    context.lineTo(x, y);
  }
  context.stroke();

  context.restore();
};

const splits = [2, 3];
do {
  splits.push(splits[splits.length - 2] + splits[splits.length - 1]);
} while (splits.length < 12);
splits.unshift(0);
splits.reverse();

const sketch = () => {

  return ({ context, width, height }) => {

    const rpad = width * 0.48 / splits.length;

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    splits.forEach((s, i) => drawSplit(context, width, height, rpad * (splits.length - i), s));
  };
};

canvasSketch(sketch, settings);
