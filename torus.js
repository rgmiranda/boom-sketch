const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');

const numLines = 64;
const minLineWidth = 1;
const maxLineWidth = 24;
const midLineWidth = (maxLineWidth + minLineWidth) * 0.5;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'torus',
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawTorus = (context, width, height) => {
  const angle = 2 * Math.PI / numLines;
  const minRadius = width * 0.2;
  const maxRadius = width * 0.45;
  const midRadius = (maxRadius - minRadius) / 3;

  context.save();

  context.translate(width * 0.5, height * 0.5);
  context.rotate(Math.PI * -0.25);

  for (let i = 0; i < numLines; i++) {

    context.beginPath();
    context.moveTo(minRadius, 0);
    context.lineTo(minRadius + midRadius, 0);
    // context.lineWidth = (i >= numLines * 0.5) ? maxLineWidth : minLineWidth;
    context.lineWidth = math.mapRange(Math.abs(i - numLines * 0.5), 0, numLines * 0.5, maxLineWidth, minLineWidth);
    context.stroke();

    context.beginPath();
    context.moveTo(minRadius + midRadius, 0);
    context.lineTo(minRadius + 2 * midRadius, 0);
    context.lineWidth = midLineWidth;
    context.stroke();

    context.beginPath();
    context.moveTo(minRadius + 2 * midRadius, 0);
    context.lineTo(maxRadius, 0);
    // context.lineWidth = (i >= numLines * 0.5) ? minLineWidth : maxLineWidth;
    context.lineWidth = math.mapRange(Math.abs(i - numLines * 0.5), 0, numLines * 0.5, minLineWidth, maxLineWidth);
    context.stroke();

    context.rotate(angle);
  }

  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawTorus(context, width, height);
  };
};

canvasSketch(sketch, settings);
