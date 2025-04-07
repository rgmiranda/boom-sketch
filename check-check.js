const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'check-check'
};

const pixels = 9;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } pixelSize 
 */
const drawCheckers = (context, width, height, pixelSize) => {
  let black = true;
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      context.fillStyle = black ? 'black' : 'white';
      context.fillRect(x, y, pixelSize, pixelSize);
      black = !black;
    }
  }
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } pixelSize 
 */
const drawSubCheckers = (context, width, height, pixelSize) => {
  const subpixelSize = pixelSize * 0.2;
  let inverted = true;
  for (let y = 0; y < height + pixelSize; y += pixelSize) {
    for (let x = 0; x < width + pixelSize; x += pixelSize) {

      const swapped = (x < width * 0.5 && y > height * 0.5) ||
        (x > width * 0.5 && y < height * 0.5);

      context.save();
      context.translate(x, y);
      context.rotate(Math.PI * 0.25);

      if (swapped) {
        context.fillStyle = inverted ? 'white' : 'black';
      } else {
        context.fillStyle = inverted ? 'black' : 'white';
      }
      context.fillRect(-subpixelSize, -subpixelSize, subpixelSize, subpixelSize);
      context.fillRect(0, 0, subpixelSize, subpixelSize);
      
      if (swapped) {
        context.fillStyle = inverted ? 'black' : 'white';
      } else {
        context.fillStyle = inverted ? 'white' : 'black';
      }
      context.fillRect(-subpixelSize, 0, subpixelSize, subpixelSize);
      context.fillRect(0, -subpixelSize, subpixelSize, subpixelSize);

      context.restore();

      inverted = !inverted;
    }
    inverted = !inverted;
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    const pixelSize = width / pixels;

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawCheckers(context, width, height, pixelSize);
    drawSubCheckers(context, width, height, pixelSize);

  };
};

canvasSketch(sketch, settings);
