const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'closing'
};
const colors = createColormap({
  colormap: 'spring',
  nshades: 16
});
let numStrokes = 18;

const sketch = () => {
  return ({ context, width, height }) => {
    let size = width;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, height * 0.5);
    context.lineWidth = 1;

    colors.forEach(c => {
      context.strokeStyle = c;
      for (let i = 0; i < numStrokes; i++) {
        const offset = size * 0.5 * eases.cubicIn(i / (Math.floor(numStrokes) - 1));
        
        context.beginPath();
        context.moveTo(-size * 0.5, -offset);
        context.lineTo(-offset, -size * 0.5);
        context.stroke();
        
        context.beginPath();
        context.moveTo(-size * 0.5, +offset);
        context.lineTo(-offset, size * 0.5);
        context.stroke();

        context.beginPath();
        context.moveTo(size * 0.5, +offset);
        context.lineTo(+offset, size * 0.5);
        context.stroke();
        
        context.beginPath();
        context.moveTo(size * 0.5, -offset);
        context.lineTo(offset, -size * 0.5);
        context.stroke();

      };
      size *= Math.SQRT1_2;
      numStrokes --;
      context.rotate(Math.PI * 0.25);
    });
  };
};

canvasSketch(sketch, settings);
