const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const numLines = 16;
const turns = 4;

const sketch = () => {
  return ({ context, width, height }) => {
    const trackWidth = width / (turns + 1);
    const lineWidth = trackWidth /(2 * numLines);
    context.lineWidth = lineWidth;
    context.fillStyle = '#eeeedd';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'black';

    for (let i = 1; i < turns; i++) {

      const x = lineWidth * i * (2 * numLines);

      for(let j = 0; j < numLines; j++) {
        const r = 2 * (j + 0.5) * lineWidth;

        context.beginPath();
        context.moveTo(x + r, trackWidth);
        context.lineTo(x + r, height - trackWidth);
        context.stroke();

        if ( i % 2 === 0 ) {
          context.beginPath();
          context.arc(x, trackWidth, r, Math.PI * 1.5, Math.PI * 2);
          context.stroke();
          context.beginPath();
          context.arc(x + trackWidth, height - trackWidth, r, Math.PI * 0.5, Math.PI);
          context.stroke();
        } else {
          context.beginPath();
          context.arc(x + trackWidth, trackWidth, r, Math.PI, Math.PI * 1.5);
          context.stroke();
          context.beginPath();
          context.arc(x, height - trackWidth, r, 0, Math.PI * 0.5);
          context.stroke();
        }
      }
      
    }
  };
};

canvasSketch(sketch, settings);
