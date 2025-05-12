const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'unboxing'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawBox = (context, width, height) => {
  const boxHeight = height * 0.6;
  const stripes = 16;
  const pad = boxHeight / stripes;
  const x = width * 0.5;
  const by = (height + boxHeight) * 0.5;
  const ty = (height - boxHeight) * 0.5;
  context.lineCap = 'butt';

  for (let i = 0; i < stripes; i++) {
    const lineWidth = math.mapRange(stripes - i, 1, stripes, 1, pad * 0.75);
    context.lineWidth = lineWidth;
    const y = ty + (i + 1) * pad;
    context.beginPath();
    context.moveTo(x - boxHeight * 0.75 + lineWidth * 0.5, y - lineWidth * 0.5  );
    context.lineTo(x, y - boxHeight * 0.2 - lineWidth * 0.5 );
    context.lineTo(x + boxHeight * 0.75 - lineWidth * 0.5, y - lineWidth * 0.5  );
    context.lineTo(x + boxHeight * 0.75 - lineWidth * 0.5, by - lineWidth * 0.5);
    context.lineTo(x, by + boxHeight * 0.2 - lineWidth * 0.5);
    context.lineTo(x - boxHeight * 0.75 + lineWidth * 0.5, by - lineWidth * 0.5);
    context.closePath();
    context.fill();
    context.stroke();
  }

  for (let i = 0; i < stripes; i++) {
    const lineWidth = math.mapRange(stripes - i, 1, stripes, 1, pad * 0.75);
    context.lineWidth = lineWidth;
    const y = ty + (i + 1) * pad;
    context.beginPath();
    context.moveTo(x - boxHeight * 0.75 + lineWidth * 0.5, y);
    context.lineTo(x, y + boxHeight * 0.2);
    context.lineTo(x + boxHeight * 0.75 - lineWidth * 0.5, y);
    context.lineTo(x + boxHeight * 0.75 - lineWidth * 0.5, by - lineWidth * 0.5);
    context.lineTo(x, by + boxHeight * 0.2 - lineWidth * 0.5);
    context.lineTo(x - boxHeight * 0.75 + lineWidth * 0.5, by - lineWidth * 0.5);
    context.closePath();
    context.fill();
    context.stroke();
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawBox(context, width, height);
  };
};

canvasSketch(sketch, settings);
