const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'gliphp-expanse'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { string } text 
 * @param { number } width 
 * @param { number } height 
 * @param { number } size 
 * @param { string } color 
 * @param { number } lineWidth 
 */
const strokeText = (context, text, width, height, size, color, lineWidth) => {
  context.save();
  const font = `bold ${size}px sans-serif`;
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = metrics.width;
  const textHeight = metrics.emHeightDescent - metrics.emHeightAscent;
  
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.strokeText(text, (width - textWidth) * 0.5, (height - textHeight) * 0.575);
  context.restore();
}

const sketch = ({ width, height }) => {
  let size = 10;
  let lineWidth = 0.2;
  const ratio = 1.25;
  const nshades = Math.ceil(Math.log(width / size) / Math.log(ratio)) + 1;
  let colors = createColormap({
    nshades,
    colormap: 'greys'
  });
  let prevFrame = 0;
  return ({ context, frame }) => {
    size = 10;
    lineWidth = 0.25;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fill();
    colors.forEach(color => {
      strokeText(context, 'Ñ', width, height, size, color, lineWidth);
      size *= ratio;
      lineWidth *= 1.15;
    });

    if (prevFrame !== frame) {
      colors.unshift(colors.pop());
      prevFrame = frame;
    }
  };
};

canvasSketch(sketch, settings);
