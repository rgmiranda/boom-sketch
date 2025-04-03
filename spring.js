const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'spring',
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } frame 
 */
const drawSpring = (context, width, height, frame) => {
  const freq = 0.15;
  const circlePad = 35;
  const rw = width * 0.4;
  const rh = height * 0.15;
  let cy = height -  2 * rh, cx = width * 0.5, oy;
  let i = 0;

  while (cy > 2 * rh) {
    oy = Math.cos((i + frame * 2) * freq) * circlePad;
    context.beginPath();
    context.ellipse(cx, cy + oy, rw, rh, 0, 0, Math.PI * 2);
    context.lineWidth = circlePad;
    context.strokeStyle = 'white';
    context.stroke();
    context.lineWidth = circlePad * 0.75;
    context.strokeStyle = 'black';
    context.stroke();
    cy -= circlePad;
    i++;
  }
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawSpring(context, width, height, frame);
  };
};

canvasSketch(sketch, settings);
