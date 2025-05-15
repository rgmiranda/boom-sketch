const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'rise'
};
const stripes = 19;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawBelowSun = (context, width, height) => {
  const stripeHeight = height / (2 * stripes + 1);
  
  context.save();
  context.beginPath();
  context.rect(0, stripeHeight * (stripes + 1), width, height);
  context.clip();

  context.beginPath();
  context.arc(width * 0.5, height * 0.5, width * 0.45, 0, Math.PI);
  context.closePath();
  context.fill();
  context.restore();
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawAboveSun = (context, width, height) => {
  context.beginPath();
  context.arc(width * 0.5, height * 0.5, width * 0.45, Math.PI, Math.PI * 2);
  context.closePath();
  context.clip();
  context.fillStyle = '#CC0';
  drawStripes(context, width, height);
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawStripes = (context, width, height) => {
  const stripeHeight = height / (2 * stripes + 1);
  let y = 0;
  while (y < height) {
    context.fillRect(0, y, width, stripeHeight);
    y += stripeHeight * 2;
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#CC0';
    drawBelowSun(context, width, height);
    context.fillStyle = 'black';
    drawStripes(context, width, height);
    drawAboveSun(context, width, height);
  };
};

canvasSketch(sketch, settings);
