const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { getRandomSeed } = require('canvas-sketch-util/random');
const { loadImage, getImageBrightness } = require('../images')

const cvWidth = cvHeight = 1080;

const pixelSize = 20;
const rows = cvHeight / pixelSize;
const cols = cvWidth / pixelSize;
const name = `slashes-${getRandomSeed()}`;

let image, imageBrightness;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name
};

const sketch = async () => {
  image = await loadImage('images/vermeer.jpg');
  imageBrightness = getImageBrightness(image);
  return ({ context, width, height }) => {
    let x, y, ix, iy, idx, lines, lineSpacing;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'white';

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        x = i * pixelSize;
        y = j *  pixelSize;
        ix = Math.floor(mapRange(x, 0, width, 0, image.width));
        iy = Math.floor(mapRange(y, 0, height, 0, image.height));
        idx = iy * image.width + ix;

        lines = mapRange(imageBrightness[idx], 0, 255, 1, 8, true);
        lineSpacing = pixelSize / lines;

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + pixelSize, y + pixelSize);
        context.stroke();
        for (let k = 1; k < lines; k++) {
          context.beginPath();
          context.moveTo(x + k * lineSpacing, y);
          context.lineTo(x + pixelSize, y + pixelSize - lineSpacing * k);
          context.stroke();

          context.beginPath();
          context.moveTo(x, y + k * lineSpacing);
          context.lineTo(x + pixelSize - k * lineSpacing, y + pixelSize);
          context.stroke();

        }
      }
    }
  };
};

canvasSketch(sketch, settings);
