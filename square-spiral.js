const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'square-spiral'
};

const squareSize = 50;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } radius 
 */
const drawCircle = (context, width, height, radius) => {
  const perimeter = 2 * Math.PI * radius;
  const squares = Math.floor(perimeter / squareSize);
  const angle = 2 * Math.PI / squares;

  context.save();
  context.lineWidth = 4;
  
  context.translate(width * 0.5, height * 0.5);

  context.rotate(radius / width);
  for (let i = 0; i < squares; i++) {
    context.save();
    context.strokeStyle = (i % 2) === 0 ? 'white' : 'black';
    context.translate(radius, 0);
    context.rotate(-0.5);
    context.beginPath();
    context.rect(0, -squareSize * 0.75, squareSize * 0.75, squareSize * 0.75);
    context.stroke();
    context.restore();
    context.rotate(angle);
  }

  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = '#909090';
    context.fillRect(0, 0, width, height);
    drawCircle(context, width, height, 115);
    drawCircle(context, width, height, 210);
    drawCircle(context, width, height, 305);
    drawCircle(context, width, height, 400);
    drawCircle(context, width, height, 498);
  };
};

canvasSketch(sketch, settings);
