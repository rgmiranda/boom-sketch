const canvasSketch = require('canvas-sketch');
const numSides = 6;
const initRadius = 50;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `polygoner-${numSides}-${Date.now()}`
};

const angle = 2 * Math.PI / numSides;
const ratio = 1 / (Math.sin((Math.PI - angle) * 0.5));

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } radius 
 */
const drawPolygon = (ctx, radius) => {
  let currentAngle = -Math.PI * 0.5;
  let x, y;
  for (let i = 0; i < numSides; i++) {
    ctx.beginPath();
    x = Math.cos(currentAngle - angle * 0.5) * radius / ratio;
    y = Math.sin(currentAngle - angle * 0.5) * radius / ratio;
    ctx.moveTo(x, y);
    
    x = Math.cos(currentAngle) * radius;
    y = Math.sin(currentAngle) * radius;
    ctx.lineTo(x, y);
    
    x = Math.cos(currentAngle + angle * 0.5) * radius / ratio;
    y = Math.sin(currentAngle + angle * 0.5) * radius / ratio;
    ctx.lineTo(x, y);
    
    ctx.closePath();
    ctx.fillStyle = (i % 2) === 0 ? 'white' : 'black';
    ctx.strokeStyle = (i % 2) === 0 ? 'black' : 'white';
    ctx.fill();
    ctx.stroke();

    currentAngle += angle;
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    let radius = initRadius;
    context.fillStyle = 'black';
    context.lineWidth = 3;
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    while (radius < width * 0.5) {
      drawPolygon(context, radius);
      radius *= ratio;
      radius *= ratio;
      context.rotate(angle * 0.5);
    }
  };
};

canvasSketch(sketch, settings);
