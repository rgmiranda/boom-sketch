const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'sponge'
};

const cellSize = 108;

const colors = createColormap({
  nshades: 9,
  colormap: 'greys',
});

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawNet = (context, width, height) => {
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const lineWidth = cellSize / colors.length;
  context.lineWidth = lineWidth;
  context.lineCap = 'square';

  colors.forEach((c, k) => {
    k++;
    context.strokeStyle = c;
    for (let i = 0; i < Math.max(cols, rows); i++) {
      context.beginPath();
      context.moveTo(i * cellSize + k * lineWidth, 0);
      context.lineTo(width, height - i * cellSize - k * lineWidth);
      context.stroke();
  
      context.beginPath();
      context.moveTo(0, (i + 1) * cellSize - k * lineWidth);
      context.lineTo(width - ((i + 1) * cellSize) + k * lineWidth, height);
      context.stroke();
  
      context.beginPath();
      context.moveTo(width - i * cellSize - k * lineWidth, 0);
      context.lineTo(0, height - i * cellSize - k * lineWidth);
      context.stroke();

      context.beginPath();
      context.moveTo(width, (i + 1) * cellSize - k * lineWidth);
      context.lineTo((i + 1) * cellSize - k * lineWidth, height);
      context.stroke();
    }
  });

};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'red';
    context.fillRect(0, 0, width, height);
    drawNet(context, width, height);
  };
};

canvasSketch(sketch, settings);
