const canvasSketch = require('canvas-sketch');
const { color, random } = require('canvas-sketch-util');

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
const drawLeaves = (context, width, height) => {
  let leaves = 1024;
  
  for (let i = 0; i < leaves; i++) {
    const size = random.rangeFloor(80, 120);
    context.save();
    context.translate(random.range(0, width), random.range(0, height));
    context.rotate(random.range(0, Math.PI))
    context.beginPath();
    context.moveTo(0, -size);
    context.quadraticCurveTo(-size, 0, 0, size);
    context.quadraticCurveTo(size, 0, 0, -size);
    context.closePath();
    context.fillStyle = random.pick(colors);
    context.fill();
    context.stroke();
    context.restore();
  }

};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawLeaves(context, width, height);
  };
};

canvasSketch(sketch, settings);
