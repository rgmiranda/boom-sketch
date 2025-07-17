const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'chatterbox'
};

const colors = createColormap({
  nshades: 14,
  colormap: 'bone'
}).reverse().slice(2);

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawChatterBox = (context, width, height) => {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const sc = width * Math.SQRT1_2 * 0.5;
  const sPad = sc / colors.length;
  context.save();

  context.translate(cx, cy);
  context.rotate(-0.25 * Math.PI);
  
  for (let j = 0; j < 4; j++) {
    colors.forEach((c, i) => {
      const xs = (colors.length - i) * sPad;
      const ys = (colors.length - i) * sPad * 2;
      context.beginPath();
      context.moveTo(sc - xs, 0);
      context.lineTo(sc - xs, ys);
      context.lineTo(sc + xs, 0);
      context.closePath();
      context.fillStyle = c;
      context.strokeStyle = c;
      context.fill();
      context.stroke();
    });
    context.rotate(0.5 * Math.PI);
  }


  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawChatterBox(context, width, height);
  };
};

canvasSketch(sketch, settings);
