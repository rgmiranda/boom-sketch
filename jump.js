const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'jump'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } frame 
 */
const drawCone = (context, width, height, frame) => {
  const ellipses = 32;
  const rpad = width * 0.48 / ellipses;
  const coneHeight = height * 0.35 * Math.sin(frame * 0.125);
  const hpad = coneHeight / ellipses;

  context.save();

  context.translate(width * 0.5, height * 0.5);
  for (let i = 1; i <= ellipses; i++) {
    context.beginPath();
    context.ellipse(0, i * hpad, rpad * i, rpad * i * 0.25, 0, 0, Math.PI * 2);
    context.stroke();
  }

  context.restore();
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawCone(context, width, height, frame);
  };
};

canvasSketch(sketch, settings);
