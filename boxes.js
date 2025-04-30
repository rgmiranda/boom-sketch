const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'boxes',
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } parts 
 */
const drawParts = (context, width, height, parts) => {
  const spad = width * 0.45 / parts;
  const boxHeight = spad * 0.45;
  const boxWidth = spad * 0.75;
  const lineWidth = 10;
  context.save();
  context.translate(width * 0.5, height * 0.5);
  for (let i = 0; i < parts; i++) {
    const size = (parts - i) * spad ;

    context.beginPath();
    context.moveTo(-size + lineWidth * 0.5, -size + lineWidth * 0.5);
    context.lineTo(-size + lineWidth * 0.5 + boxWidth, -size + lineWidth * 0.5 + boxHeight);
    context.lineTo(size + lineWidth * 0.5, -size + lineWidth * 0.5 + boxHeight);
    context.lineTo(size + lineWidth * 0.5, -size + lineWidth * 0.5);
    context.closePath();
    context.fillStyle = '#666';
    context.fill();

    context.beginPath();
    context.moveTo(-size + lineWidth * 0.5, -size + lineWidth * 0.5);
    context.lineTo(-size + lineWidth * 0.5 + boxWidth, -size + lineWidth * 0.5 + boxHeight);
    context.lineTo(-size + lineWidth * 0.5 + boxWidth, size + lineWidth * 0.5 + boxHeight);
    context.lineTo(-size + lineWidth * 0.5, size + lineWidth * 0.5);
    context.closePath();
    context.fillStyle = '#AAA';
    context.fill();
  }

  for (let i = 0; i < parts; i++) {
    const size = (i + 1) * spad;
    
    context.beginPath();
    context.moveTo(-size - lineWidth * 0.5, size + lineWidth * 0.5);
    context.lineTo(-size - lineWidth * 0.5 + boxWidth, size + lineWidth * 0.5 + boxHeight);
    context.lineTo(size + lineWidth * 0.5 + boxWidth, size + lineWidth * 0.5 + boxHeight);
    context.lineTo(size + lineWidth * 0.5, size + lineWidth * 0.5);
    context.closePath();
    context.fillStyle = '#666';
    context.fill();

    context.beginPath();
    context.moveTo(size + lineWidth * 0.5, -size - lineWidth * 0.5);
    context.lineTo(size + lineWidth * 0.5 + boxWidth, -size - lineWidth * 0.5 + boxHeight);
    context.lineTo(size + lineWidth * 0.5 + boxWidth, size + lineWidth * 0.5 + boxHeight);
    context.lineTo(size + lineWidth * 0.5, size + lineWidth * 0.5);
    context.closePath();
    context.fillStyle = '#AAA';
    context.fill();

    context.beginPath();
    context.moveTo(-size, -size);
    context.lineTo(size, -size);
    context.lineTo(size, size);
    context.lineTo(-size, size);
    context.closePath();
    context.strokeStyle = '#FFF';
    context.lineWidth = lineWidth
    context.stroke();
  }
  context.restore();
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);
    drawParts(context, width, height, 8)
  };
};

canvasSketch(sketch, settings);
