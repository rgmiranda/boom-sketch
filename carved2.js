const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'carved2'
};


/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } size 
 * @param { boolean } rotated 
 */
const drawTrigCarving = (context, width, height, size, rotated = false) => {
  const cx = width * 0.5;
  const cy = height * 0.6;
  const xSize = size * Math.sqrt(3) * 0.5;
  const ySize = size * 0.5;

  context.save();
  context.translate(cx, cy);
  if (rotated) {
    context.rotate(Math.PI);
  }

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, -size);
  context.lineTo(xSize, ySize);
  context.closePath();
  context.fillStyle = 'black';
  context.fill();
  context.stroke();

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(xSize, ySize);
  context.lineTo(-xSize, ySize);
  context.closePath();
  context.fillStyle = 'gray';
  context.fill();
  context.stroke();

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, -size);
  context.lineTo(-xSize, ySize);
  context.closePath();
  context.fillStyle = 'white';
  context.fill();
  context.stroke();
  
  context.restore();
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } size 
 * @param { boolean } rotated 
 */
const drawCarving = (context, width, height, size, rotated = false) => {
  const cx = width * 0.5;
  const cy = height * 0.6;
  const xSize = size * Math.sqrt(3) * 0.5;
  const ySize = size * 0.5;

  context.save();
  context.translate(cx, cy);
  if (rotated) {
    context.rotate(Math.PI);
  }

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, -size);
  context.lineTo(xSize, -ySize);
  context.lineTo(xSize, ySize);
  context.closePath();
  context.fillStyle = 'black';
  context.fill();
  context.stroke();

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(xSize, ySize);
  context.lineTo(0, size);
  context.lineTo(-xSize, ySize);
  context.closePath();
  context.fillStyle = 'gray';
  context.fill();
  context.stroke();

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, -size);
  context.lineTo(-xSize, -ySize);
  context.lineTo(-xSize, ySize);
  context.closePath();
  context.fillStyle = 'white';
  context.fill();
  context.stroke();
  
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawTrigCarving(context, width, height, width * 0.48, false);
    drawCarving(context, width, height, width * 0.24, true);
  };
};

canvasSketch(sketch, settings);
