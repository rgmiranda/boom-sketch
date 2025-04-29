const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'arc'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } arcs 
 */
const drawArcs = (context, width, height, arcs) => {
  const rpad = width * 0.48 / arcs;

  context.save();
  context.strokeStyle = 'white';
  context.translate(width * 0.5, height * 0.5);
  for (let i = 0; i < arcs; i++) {
    const radius = (i + 1) * rpad;
    context.lineWidth = math.mapRange(arcs * 0.5 - Math.abs(arcs * 0.5 - i), 1, arcs * 0.5, 1, rpad, true);
    //context.lineWidth = math.mapRange(arcs - i, 1, arcs, 1, rpad, true);
    //context.lineWidth = math.mapRange(i + 1, 1, arcs, 1, rpad, true);
    context.beginPath();
    context.moveTo(-radius, height * 0.5);
    context.lineTo(-radius, 0);
    context.arc(0, 0, radius, Math.PI, Math.PI * 2);
    context.lineTo(radius, height * 0.5);
    context.stroke();
  }
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawArcs(context, width, height, 24);
  };
};

canvasSketch(sketch, settings);
