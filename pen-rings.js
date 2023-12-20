const canvasSketch = require('canvas-sketch');
const { math, random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `pen-strings-${Date.now()}`
};

const numStrings = 256;
const angle = 2 * Math.PI / numStrings;
const numTraces = 16;

const color1 = '#375E77';
const color2 = '#D2515E';
const bgcolor = '#f6eee3';

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { string } color
 */
const drawCircle = (context, width, height, color) => {
  context.save();
  context.translate(width * 0.5, height * 0.5);
  context.strokeStyle = color;

  const innerRadius = width * 0.175;
  const outerRadius = width * 0.35;
  const offset = outerRadius * Math.sin(Math.acos(innerRadius / outerRadius));
  const traceLength = offset / numTraces;

  for (let i = 0; i < numStrings; i++)
  {
    const p = random.range(-0.025, 0.025);
    const b = innerRadius + random.range(-10, 10);
    for (let j = 1; j < numTraces * 2; j++)
    {
      const x0 = -offset + (j - 1) * traceLength;
      const x1 = -offset + (j) * traceLength;
      const y0 = p * x0 + b;
      const y1 = p * x1 + b;
      context.lineWidth = math.mapRange(Math.abs(numTraces - j), 0, numTraces - 1, 1, 0.05);
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.stroke();
    }
    context.rotate(angle);
  }
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    
    context.translate(0, -height * 0.165)
    drawCircle(context, width, height, color1);
    
    /** @type { HTMLCanvasElement } */
    const cv = document.createElement('canvas');
    cv.width = width;
    cv.height = height;
    /** @type { CanvasRenderingContext2D } */
    const ctx = cv.getContext('2d');
    
    ctx.translate(0, height * 0.165);
    drawCircle(ctx, width, height, color2);
    
    context.translate(0, height * 0.165)
    context.globalCompositeOperation = 'destination-over';
    context.drawImage(cv, 0, 0, width * 0.5, height, 0, 0, width * 0.5, height);
    context.globalCompositeOperation = 'source-over';
    context.drawImage(cv, width * 0.5, 0, width * 0.5, height, width * 0.5, 0, width * 0.5, height);

    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = bgcolor;
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
