const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');

const squareSize = 108;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'skewed-checkers',
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } y 
 */
const drawRow = (context, width, height, y) => {
  let toggle = true;
  const center = height * 0.33;
  const offset = math.mapRange(Math.abs(center - (y % (center * 2))), 0, center, -1, 1) * squareSize * 0.5;
  for (let x = -squareSize; x < width + squareSize; x += squareSize) {
    context.fillStyle = toggle ? 'black' : 'white';
    context.strokeStyle = '#888';
    context.lineWidth = 2;
    context.beginPath();
    context.rect(x + offset, y, squareSize, squareSize);
    context.fill();
    context.stroke();
    toggle = !toggle;
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    for (let y = 0; y < height; y += squareSize) {
      drawRow(context, width, height, y);
    }
  };
};

canvasSketch(sketch, settings);
