const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'boxing'
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
  const ty = (height - boxHeight) * 0.45;
  const yoffset = boxHeight * 0.25;
  const xoffset = boxHeight * 0.75;
  const padRatio = 0.2;

  for (let i = 0; i < stripes; i++) {
    const y = ty + (i + 1) * pad;
    context.beginPath();
    context.moveTo(x - xoffset, y);
    context.lineTo(x, y - yoffset );
    context.lineTo(x, y - yoffset + pad * padRatio);
    context.lineTo(x - xoffset, y + pad * padRatio);
    context.closePath();
    context.fillStyle = 'white';
    context.fill();

    context.beginPath();
    context.moveTo(x - xoffset, y + pad * padRatio);
    context.lineTo(x, y - yoffset + pad * padRatio);
    context.lineTo(x, y - yoffset + pad);
    context.lineTo(x - xoffset, y + pad);
    context.closePath();
    context.fillStyle = 'black';
    context.fill();

    context.beginPath();
    context.moveTo(x + xoffset, y);
    context.lineTo(x, y - yoffset );
    context.lineTo(x, y - yoffset + pad * padRatio);
    context.lineTo(x + xoffset, y + pad * padRatio);
    context.closePath();
    context.fillStyle = 'black';
    context.fill();

    context.beginPath();
    context.moveTo(x + xoffset, y + pad * padRatio);
    context.lineTo(x, y - yoffset + pad * padRatio);
    context.lineTo(x, y - yoffset + pad);
    context.lineTo(x + xoffset, y + pad);
    context.closePath();
    context.fillStyle = 'white';
    context.fill();
  }

  for (let i = 0; i < stripes; i++) {
    const y = ty + (i + 1) * pad;
    context.beginPath();
    context.moveTo(x - xoffset, y);
    context.lineTo(x, y + yoffset );
    context.lineTo(x, y + yoffset + pad * padRatio);
    context.lineTo(x - xoffset, y + pad * padRatio);
    context.closePath();
    context.fillStyle = 'black';
    context.fill();

    context.beginPath();
    context.moveTo(x - xoffset, y + pad * padRatio);
    context.lineTo(x, y + yoffset + pad * padRatio);
    context.lineTo(x, y + yoffset + pad);
    context.lineTo(x - xoffset, y + pad);
    context.closePath();
    context.fillStyle = 'white';
    context.fill();

    context.beginPath();
    context.moveTo(x + xoffset, y);
    context.lineTo(x, y + yoffset );
    context.lineTo(x, y + yoffset + pad * padRatio);
    context.lineTo(x + xoffset, y + pad * padRatio);
    context.closePath();
    context.fillStyle = 'white';
    context.fill();

    context.beginPath();
    context.moveTo(x + xoffset, y + pad * padRatio);
    context.lineTo(x, y + yoffset + pad * padRatio);
    context.lineTo(x, y + yoffset + pad);
    context.lineTo(x + xoffset, y + pad);
    context.closePath();
    context.fillStyle = 'black';
    context.fill();
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
