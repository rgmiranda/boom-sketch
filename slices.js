const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'slices',
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawSlices = (context, width, height) => {
  const radius = width * 0.48;
  const slices = 10;
  const angle = 0.5 * Math.PI / (slices);
  
  context.fillStyle = 'white';
  context.strokeStyle = 'white';
  context.shadowColor = 'black';
  context.shadowBlur = 10;
  
  context.save();
  context.translate(width * 0.5, height * 0.5);
  
  for (let i = 0.5; i <= slices; i++) {
    const x = Math.cos(i * angle) * radius;
    const y = Math.sin(i * angle) * radius;
    
    context.shadowOffsetX = 10;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(x, y);
    context.lineTo(x, -y);
    context.closePath();
    context.fill();
    
    context.shadowOffsetX = -10;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(-x, y);
    context.lineTo(-x, -y);
    context.closePath();
    context.fill();
  }
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawSlices(context, width, height);
  };
};

canvasSketch(sketch, settings);
