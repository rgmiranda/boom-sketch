const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'oct-star'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } radius 
 * @param { number } cellSize 
 */
const drawBlade = (context, radius, cellSize) => {
  const cells = Math.ceil(radius / cellSize);
  context.fillStyle = 'white';
  for (let j = 0; j < cells; j++) {
    const y = j * cellSize;
    for (let i = 0; i < cells - j; i++) {
      const x = i * cellSize;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y + cellSize);
      context.lineTo(x + cellSize, y + cellSize);
      context.closePath();
      context.fill();
    }
  }
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawMill = (context, width, height) => {
  context.save();
  context.translate(width * 0.5, height * 0.5);
  const angles = 8;
  const angle = 2 * Math.PI / angles;
  const radius = width * 0.4;
  const skew = 0.4150;

  for (let i = 0; i < angles; i++) {
    context.save();
    context.transform(1, skew, skew, 1, 0, 0);
    drawBlade(context, radius, 50);
    context.restore();

    context.rotate(angle);
  }
  
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawMill(context, width, height);
  };
};

canvasSketch(sketch, settings);
