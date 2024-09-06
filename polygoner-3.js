const canvasSketch = require('canvas-sketch');
const numSides = 6;
const initRadius = 60;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `polygoner-3-${numSides}-${Date.now()}`
};

const angle = 2 * Math.PI / numSides;
const subratio = (1 / (Math.sin((Math.PI - angle) * 0.5))) ** 3;
const midratio = (1 / (Math.sin((Math.PI - angle) * 0.5))) ** 4;
const upratio = (1 / (Math.sin((Math.PI - angle) * 0.5))) ** 5;

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } radius 
 */
const drawPolygon = (ctx, radius) => {
  let currentAngle = -Math.PI * 0.5;
  let prevRadius;
  let x, y;
  for (let i = 0; i < numSides; i++) {
    prevRadius = radius / subratio;
    ctx.fillStyle = (i % 2) === 0 ? 'white' : 'black';
    ctx.strokeStyle = (i % 2) === 0 ? 'black' : 'white';

    ctx.beginPath();
    x = Math.cos(currentAngle) * radius;
    y = Math.sin(currentAngle) * radius;
    ctx.moveTo(x, y);
    
    x = Math.cos(currentAngle + angle) * radius;
    y = Math.sin(currentAngle + angle) * radius;
    ctx.lineTo(x, y);
    
    x = Math.cos(currentAngle + angle * 0.5) * prevRadius;
    y = Math.sin(currentAngle + angle * 0.5) * prevRadius;
    ctx.lineTo(x, y);
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    prevRadius = radius / midratio
    
    ctx.beginPath();
    x = Math.cos(currentAngle + angle * 0.5) * prevRadius;
    y = Math.sin(currentAngle + angle * 0.5) * prevRadius;
    ctx.lineTo(x, y);
    ctx.moveTo(x, y);
    
    x = Math.cos(currentAngle - angle * 0.5) * prevRadius;
    y = Math.sin(currentAngle - angle * 0.5) * prevRadius;
    ctx.lineTo(x, y);

    x = Math.cos(currentAngle) * prevRadius * subratio;
    y = Math.sin(currentAngle) * prevRadius * subratio;
    ctx.lineTo(x, y);

    ctx.closePath();
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
    context.lineCap = 'round';
    context.lineJoin = 'bevel';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    while (radius < width * 0.5) {
      drawPolygon(context, radius);
      radius *= upratio;
      context.rotate(angle * 0.5);
    }
  };
};

canvasSketch(sketch, settings);
