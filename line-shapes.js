const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name:'shape-line'
};

const stripeWidth = 2;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } r 
 * @param { string } color 
 */
const fillStripes = (context, r, color, shift) => {
  context.fillStyle = color;
  let x = -r + shift * stripeWidth;
  while (x < r) {
    context.fillRect(x, -r, stripeWidth, 2 * r);
    x += stripeWidth * 3;
  }
}

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 * @param { number } r 
 * @param { number } shift 
 */
const drawTriangle = (context, x, y, r, shift) => {
  context.save();

  context.translate(x, y);
  context.beginPath();
  let angle = -Math.PI * 0.5;
  context.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
  angle += 2 * Math.PI / 3;
  context.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  angle += 2 * Math.PI / 3;
  context.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  context.closePath();
  context.clip();

  fillStripes(context, r, 'magenta', shift);

  context.restore();
}

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 * @param { number } r 
 * @param { number } shift 
 */
const drawSquare = (context, x, y, r, shift) => {
  context.save();

  context.translate(x, y);
  context.beginPath();
  let angle = -Math.PI * 0.25;
  context.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
  angle += Math.PI * 0.5;
  context.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  angle += Math.PI * 0.5;
  context.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  angle += Math.PI * 0.5;
  context.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  context.closePath();
  context.clip();

  fillStripes(context, r, 'turquoise', shift);

  context.restore();
}

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 * @param { number } r 
 * @param { number } shift 
 */
const drawCircle = (context, x, y, r, shift) => {
  context.save();

  context.translate(x, y);
  context.beginPath();
  context.arc(0, 0, r, 0, Math.PI * 2);
  context.clip();

  fillStripes(context, r, 'yellow', shift);

  context.restore();
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const r = width * 0.5
    const t = stripeWidth * 3 * 25;

    drawTriangle(context, width * 0.5 + t, height * 0.5 - t, r, 0);
    drawSquare(context, width * 0.5, height * 0.5, r, 1);
    drawCircle(context, width * 0.5 - t, height * 0.5 + t, r - stripeWidth * 3 * 25, 2);
  };
};

canvasSketch(sketch, settings);
