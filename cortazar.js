const canvasSketch = require('canvas-sketch');
const { loadImage, getImageBrightness } = require('./images');
const { math } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'cortazar'
};
const imageFile = 'cortazar.jpg';

const colors = ['#000000', '#14213d', '#fca311', '#e5e5e5', '#ffffff'];

const pixelSize = 1080 / 108;

const sketch = async () => {

  const image = await loadImage(`images/${imageFile}`);
  const imageBrightness = getImageBrightness(image);

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let y = 0; y < height; y += pixelSize) {
      const iy = Math.floor(math.mapRange(y, 0, height, 0, image.height, true));
      for (let x = 0; x < width; x += pixelSize) {
        const ix = Math.floor(math.mapRange(x, 0, width, 0, image.width, true));
        const idx = iy * image.width + ix;
        const b = imageBrightness[idx];
        const cidx = Math.floor(math.mapRange(b, 0, 255, 0, colors.length - 1));

        context.fillStyle = colors[cidx];
        context.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  };
};

canvasSketch(sketch, settings);
