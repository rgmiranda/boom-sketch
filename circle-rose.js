const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'circle-flower'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawRose = (context, width, height) => {
  const angles = 18;
  const angle = 2 * Math.PI / angles;
  //const color = '#FF996666';
  const color = '#FFFFFF80';
  const radius = width * 0.48;
  const grad = context.createRadialGradient(0, radius * 0.5, 0, 0, radius * 0.5, radius * 0.5);
  grad.addColorStop(0.75, '#FFFFFF00');
  grad.addColorStop(1, color);
  context.save();
  context.translate(width * 0.5, height * 0.5);
  context.fillStyle = grad;

  for (let i = 0; i < angles; i++) {
    context.beginPath();
    context.arc(0, radius * 0.5, radius * 0.5, 0, Math.PI * 2);
    context.fill();
    context.rotate(angle);
  }
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'destination-over'
    drawRose(context, width, height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
