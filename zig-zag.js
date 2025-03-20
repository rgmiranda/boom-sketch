const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'zig-zag',
};

const numVerticalLines = 6;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } amp 
 */
const drawZigZagLine = (context, width, height, amp) => {
  const hstep = width / numVerticalLines;
  let direction = 1;
  context.strokeStyle = '#69A';
  for (let x = hstep * 0.5; x < width; x += hstep) {
    context.beginPath();
    context.moveTo(x - amp, height + amp * direction);
    context.lineTo(x + amp, height - amp * direction);
    context.stroke();
    direction *= -1;
  }
};

const drawVerticalLines = (context, width, height) => {
  context.strokeStyle = 'black';
  const hstep = width / numVerticalLines;
  for (let x = hstep * 0.5; x < width; x += hstep) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

};

const sketch = () => {
  return ({ context, width, height }) => {
    const amp = 50;
    context.fillStyle = '#f6eee3';
    context.fillRect(0, 0, width, height);
    context.lineWidth = 20;
    for (let y = 0; y <= 1.05; y += 0.05) {
      drawZigZagLine(context, width, height * y, amp);
    }
    context.lineWidth = 20;
    drawVerticalLines(context, width, height);
  };
};

canvasSketch(sketch, settings);
