const canvasSketch = require('canvas-sketch');
const { color } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const colors = [
  color.RGBAToHex([255, 255, 255, 255]),
  color.RGBAToHex([255, 255, 192, 255]),
  color.RGBAToHex([255, 255, 128, 255]),
  color.RGBAToHex([255, 255, 64, 255]),
  color.RGBAToHex([255, 255, 0, 255]),
  color.RGBAToHex([192, 192, 0, 255]),
  color.RGBAToHex([128, 128, 0, 255]),
  color.RGBAToHex([64, 64, 0, 255]),
].reverse();

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawLeaf = (context, width, height) => {
  const hpad = height * 0.48 / colors.length;

  context.save();
  context.translate(width * 0.5, height * 0.5);
  colors.forEach((c, i) => {
    context.save();
    context.translate(0, i * hpad * 0.9);
    const size = (colors.length - i) * hpad;
    context.beginPath();
    context.moveTo(0, -size);
    context.quadraticCurveTo(-size, 0, 0, size);
    context.quadraticCurveTo(size, 0, 0, -size);
    context.closePath();
    context.fillStyle = c;
    context.fill();
    context.restore();
  });
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawLeaf(context, width, height);
  };
};

canvasSketch(sketch, settings);
