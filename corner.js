const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'corner-street'
};

const stripes = 16;
const bgSize = 0.55;
const bgPos = 0.35;

/** @type { [number, number, number] } */
const cornerPos = [0.45, 0.5, 0.95];

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawStripes = (context, width, height) => {
  const stripeWidth = 0.5 * height / stripes;
  context.lineWidth = stripeWidth;
  for (let i = 0; i < stripes; i++) {
    const y = (i + 0.5) * stripeWidth * 2;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawCorner = (context, width, height) => {
  const x0 = width * cornerPos[0];
  const x1 = width * cornerPos[1];
  const x2 = width * cornerPos[2];

  const bgStripeWidth = 0.5 * height * bgSize / stripes;
  const fgStripeWidth = 0.5 * height / stripes;

  for (let i = 0; i < stripes; i++) {
    const bgy = height * bgPos + (i + 0.25) * bgStripeWidth * 2;
    const fgy = (i + 0.25) * fgStripeWidth * 2;
    context.beginPath();
    context.moveTo(x0, bgy);
    context.lineTo(x1, fgy);
    context.lineTo(x2, bgy);
    context.lineTo(x2, bgy + bgStripeWidth);
    context.lineTo(x1, fgy + fgStripeWidth);
    context.lineTo(x0, bgy + bgStripeWidth);
    context.closePath();
    context.fill();
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#FFF';
    context.strokeStyle = '#FFF';

    context.save();
    context.translate(0, height * bgPos);
    drawStripes(context, width * cornerPos[0], height * bgSize);
    context.restore();

    context.save();
    context.translate(width * cornerPos[2], height * bgPos);
    drawStripes(context, width * (1 - cornerPos[2]), height * bgSize);
    context.restore();
    
    drawCorner(context, width, height);
  };
};

canvasSketch(sketch, settings);
