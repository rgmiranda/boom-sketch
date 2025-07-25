const canvasSketch = require('canvas-sketch');
const { loadImage, getImageBrightness } = require('./images');
const { math } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'maradona'
};

const xSize = 15;
const ySize = 1;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { HTMLImageElement } image 
 */
const renderImage = (context, width, height, image) => {
  const imageBrightness = getImageBrightness(image);
  context.fillStyle = 'white';

  for (let y = 0; y < height; y += ySize) {
    const iy = Math.floor(math.mapRange(y, 0, height, 0, image.height));
    for (let x = 0; x < width; x += xSize) {
      const ix = Math.floor(math.mapRange(x, 0, width, 0, image.width));
      const idx = iy * image.width + ix;
      const rw = math.mapRange(imageBrightness[idx], 0, 255, 0, xSize);
      context.fillRect(x + (xSize - rw) * 0.5, y, rw, ySize);
    }
  }
};

const sketch = async () => {
  const image = await loadImage('images/maradona.jpg');
  return ({ context, width, height }) => {

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    renderImage(context, width, height, image);
  };
};

canvasSketch(sketch, settings);
