const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const numLines = 12;
const turns = 8;

const sketch = () => {
  return ({ context, width, height }) => {
    const trackWidth = width / (turns + 1);
    const lineWidth = trackWidth /(2 * numLines);
    context.lineWidth = lineWidth;
    context.fillStyle = '#eeeedd';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'black';

    for (let i = 0; i < turns + 1; i++) {

      const x = i * trackWidth;

      for (let j = 0; j < turns + 1; j++) {

        const y = j * trackWidth;

        for(let k = 0; k < numLines; k++) {
          const r = 2 * (k + 0.5) * lineWidth;

          if ( j === 0 || j === turns) {
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
            continue;
          }
          if ( i === 0 || i === turns) {
            if ( j % 2 === 0 ) {
              context.beginPath();
              context.arc(trackWidth, y, r, Math.PI * 1.5, Math.PI * 2);
              context.stroke();
              context.beginPath();
              context.arc(width - trackWidth, y + trackWidth, r, Math.PI * 0.5, Math.PI);
              context.stroke(); 
            } else {
              context.beginPath();
              context.arc(trackWidth, y + trackWidth, r, Math.PI, Math.PI * 1.5);
              context.stroke();
              context.beginPath();
              context.arc(width - trackWidth, y, r, 0, Math.PI * 0.5);
              context.stroke();
            }
            continue;
          }

          if ((i + j) % 2 == 0) {
            context.beginPath();
            context.moveTo(x + r, y);
            context.lineTo(x + r, y + trackWidth);
            context.stroke();
          } else {
            context.beginPath();
            context.moveTo(x, y + r);
            context.lineTo(x + trackWidth, y + r);
            context.stroke();
          }
        }
      }

      
    }
  };
};

canvasSketch(sketch, settings);
