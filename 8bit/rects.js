const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { getRandomSeed } = require('canvas-sketch-util/random');
const { loadImage, getImageBrightness } = require('../images')

const cvWidth = cvHeight = 1080;

const pixelSize = 20;
const rows = cvHeight / pixelSize;
const cols = cvWidth / pixelSize;
const name = `rects-${getRandomSeed()}`;

let image, imageBrightness;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name
};

const sketch = async () => {
  image = await loadImage('images/vermeer.jpg');
  imageBrightness = getImageBrightness(image);
  return ({ context, width, height }) => {
    let x, y, ix, iy, idx, angle, rectHeight;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'white';

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        x = i * pixelSize;
        y = j *  pixelSize;
        ix = Math.floor(mapRange(x, 0, width, 0, image.width));
        iy = Math.floor(mapRange(y, 0, height, 0, image.height));
        idx = iy * image.width + ix;

        angle = mapRange(imageBrightness[idx], 0, 255, 0, Math.PI * 0.5, true);
        rectHeight = mapRange(imageBrightness[idx], 0, 255, 0, pixelSize, true);

        context.save();

        context.translate(x + pixelSize * 0.5, y + pixelSize * 0.5);
        context.rotate(angle);
        context.fillRect(- pixelSize * 0.5, - rectHeight * 0.5, pixelSize, rectHeight);

        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings);
