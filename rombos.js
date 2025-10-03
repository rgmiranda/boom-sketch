const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'rombos'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawDiamonds = (context, width, height) => {
  const cellWidth = 81;
  const cellHeight = 108;
  const linesPerCol = 5;
  const cols = Math.ceil(width / cellWidth);
  const rows = Math.ceil(height / cellHeight);
  const maxLineWidth = width / (linesPerCol * cols);
  let mustOffset = false;

  for (let j = 0; j < rows; j++) {
    context.lineWidth = math.clamp(maxLineWidth * j / (rows - 1), 0.5, maxLineWidth);
    const y = j * cellHeight;
    context.save();

    context.beginPath();
    context.moveTo(0, height);

    for (let i = 0; i <= cols; i++) {
      const oy = mustOffset ? ((i + 1) % 2) * cellHeight : (i % 2) * cellHeight;
      const x = i * cellWidth;
      context.lineTo(x, y + oy);
    }

    context.lineTo(width, height);
    context.closePath();
    context.clip();

    for (let x = 0; x < width + maxLineWidth; x += maxLineWidth) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    context.restore();
    mustOffset = !mustOffset;
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawDiamonds(context, width, height);
  };
};

canvasSketch(sketch, settings);
