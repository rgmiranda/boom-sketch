const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'white-dwarf'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } radius 
 * @param { number } circles 
 */
const drawField = (context, radius, circles) => {
  const yr = radius * 0.5;
  let xr = 0;
  const step = radius / circles;
  for (let i = 0; i < circles; i++) {
    xr = eases.quadInOut(i / (circles - 1)) * radius;
    context.beginPath();
    context.ellipse(xr - radius * 0.5, 0, Math.abs(xr - radius * 0.5), yr, 0, 0, Math.PI * 2);
    context.stroke();
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    const fields = 6;
    const circles = 10;
    const radius = width * 1;
    const rpad = radius / fields;
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    
    for (let i = fields; i > 0; i--) {
      drawField(context, rpad * i, circles + random.rangeFloor(-3, 3));
    }
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(0, 0, rpad * 0.1, 0, Math.PI * 2);
    context.fill();
  };
};

canvasSketch(sketch, settings);
