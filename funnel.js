const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'funnel',
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawCillinder = (context, width, height) => {
  context.lineWidth = 2;
  const cillinderHeight = height * 0.5;
  const ry = height * 0.15;
  const rx = width * 0.45;
  const strokes = 24;
  const hpad = cillinderHeight / strokes;
  const rxpad = rx / strokes;
  const rypad = ry / strokes;
  const x = width * 0.5;
  let y = (height + cillinderHeight) * 0.5;
  
  for (let i = 0; i < strokes; i++) {
    context.beginPath();
    context.moveTo(x + rx, y - hpad);
    context.lineTo(x + rx, y)
    context.ellipse(x, y, rx, ry, 0, 0, Math.PI);
    context.lineTo(x - rx, y - hpad)
    context.stroke();
    y -= hpad;
  }

  for (let i = 0; i < strokes; i++) {
    context.beginPath();
    context.ellipse(x, y, rx - i * rxpad, ry - i * rypad, 0, 0, 2 * Math.PI);
    context.stroke();
    y += rypad;
  }

}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawCillinder(context, width, height);
  };
};

canvasSketch(sketch, settings);
