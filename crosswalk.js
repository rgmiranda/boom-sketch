const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'crosswalk'
};

const lines = 128;

const startAngle = Math.PI * 0.125;
const endAngle = Math.PI * 1.875;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } lines 
 * @param { number } width 
 * @param { number } height 
 * @param { number } innerRadius 
 * @param { number } outerRadius 
 * @param { number } angleOffset 
 */
const drawTracks = (context, lines, width, height, innerRadius, outerRadius, angleOffset) => {
  context.save();
  context.translate(width * 0.5, height * 0.5);
  context.rotate(angleOffset + startAngle);

  context.fillStyle = 'white';
  const angle = (endAngle - startAngle) / lines;

  for (let i = 0; i < lines; i++) {
    context.beginPath();
    context.arc(0, 0, innerRadius, 0, angle * 0.5);
    context.arc(0, 0, outerRadius, Math.PI * 0.25 + angle * 0.5, Math.PI * 0.25 + 0, true);
    context.fill();
    context.rotate(angle);
  }

  context.restore();
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    drawTracks(context, lines, width, height, width * 0.15, width * 0.45, 0);
    drawTracks(context, lines + 5, width, height, width * 0.12, width * 0.48, frame * 0.0075);
  };
};

canvasSketch(sketch, settings);
