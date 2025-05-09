const canvasSketch = require('canvas-sketch');
const stripes = 48;
const pyramidPos = 2;
const slope = 0.35;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `pyramid-${stripes}`
};


/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } stripes 
 * @param { number } pyramidPos 
 */
const drawStripes = (context, width, height, stripes, pyramidPos) => {
  const lineWidth = height / (stripes - 0.5);
  context.save();
  context.lineWidth = lineWidth;
  context.lineJoin = 'round';

  for (let i = stripes - 1; i >= 0; i--) {
    const y = 2 * lineWidth * (i + 0.5);
    if (i < pyramidPos) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
      continue;
    }

    const ox = (i - pyramidPos + 0.5) * lineWidth * 1.5;
    const oy = 2 * lineWidth * ( slope * ( i - pyramidPos) + 0.1 );
    if (ox < width * 0.5) {

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, y);
      context.lineTo(width * 0.5 - ox, y);
      context.lineTo(width * 0.5, y + oy);
      context.lineTo(width * 0.5 + ox, y);
      context.lineTo(width, y);
      context.lineTo(0, y);
      context.closePath();
      context.fill();

      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width * 0.5 - ox, y);
      context.lineTo(width * 0.5, y + oy);
      context.lineTo(width * 0.5 + ox, y);
      context.lineTo(width, y);
      context.stroke();
      continue;
    }

    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  context.restore();
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawStripes(context, width, height, stripes, pyramidPos);
  };
};

canvasSketch(sketch, settings);
