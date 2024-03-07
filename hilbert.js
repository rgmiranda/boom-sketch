const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};
const maxOrder = 4;

/**
 * 
 * @param { number } cx 
 * @param { number } cy 
 * @param { number } size 
 * @param { number } order 
 * @param { number } angle 
 * @param { string } conn
 * @param { CanvasRenderingContext2D } context 
 */
const hilbert = (cx, cy, size, order, angle, conn, context) => {
  context.save();
  context.translate(cx, cy);
  context.rotate(angle);

  if ( order > 1 ) {
    hilbert(-size * 0.25, -size * 0.25, size * 0.5, order - 1, 0, 'A', context);
    hilbert(size * 0.25, -size * 0.25, size * 0.5, order - 1, 0, 'B', context);
    hilbert(size * 0.25, size * 0.25, size * 0.5, order - 1, -Math.PI * 0.5, 'C', context);
    hilbert(-size * 0.25, size * 0.25, size * 0.5, order - 1, Math.PI * 0.5, 'D', context);
  } else {
    context.beginPath();
    context.moveTo(size * 0.25, size * 0.25);
    context.lineTo(size * 0.25, -size * 0.25);
    context.lineTo(-size * 0.25, -size * 0.25);
    context.lineTo(-size * 0.25, size * 0.25);
    context.stroke();

    context.strokeStyle = 'red';

    switch (conn) {
      case 'A':
        context.beginPath();
        context.moveTo(size * 0.25, size * 0.25);
        context.lineTo(size * 0.5, size * 0.25);
        context.stroke();
        
        context.beginPath();
        context.moveTo(-size * 0.25, size * 0.25);
        context.lineTo(-size * 0.25, size * 0.5);
        context.stroke();
        break;

      case 'B':
        context.beginPath();
        context.moveTo(-size * 0.25, size * 0.25);
        context.lineTo(-size * 0.5, size * 0.25);
        context.stroke();
        
        context.beginPath();
        context.moveTo(size * 0.25, size * 0.25);
        context.lineTo(size * 0.25, size * 0.5);
        context.stroke();
        break;

      case 'C':
        context.beginPath();
        context.moveTo(size * 0.5, size * 0.25);
        context.lineTo(size * 0.25, size * 0.25);
        context.stroke();

        context.beginPath();
        context.moveTo(-size * 0.25, size * 0.25);
        context.lineTo(-size * 0.25, size * 0.5);
        context.stroke();
        break

      case 'D':
        context.beginPath();
        context.moveTo(size * 0.25, size * 0.25);
        context.lineTo(size * 0.5, size * 0.25);
        context.stroke();

        context.beginPath();
        context.moveTo(-size * 0.5, size * 0.25);
        context.lineTo(-size * 0.25, size * 0.25);
        context.stroke();
        break
    
      default:
        break;
    }
  }

  context.restore();
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'white';
    context.lineWidth = 2;
    hilbert(width * 0.5, height * 0.5, width, maxOrder, 0, '', context);
  };
};

canvasSketch(sketch, settings);
