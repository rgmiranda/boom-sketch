const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { getRandomSeed } = require('canvas-sketch-util/random');
const { loadImage, getImageBrightness } = require('../images');

const cvWidth = cvHeight = 1080;

const pixelSize = 20;
const rows = cvHeight / pixelSize;
const cols = cvWidth / pixelSize;
const name = `backslashes-${getRandomSeed()}`;

let image, imageBrightness;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name
};

const sketch = async () => {
  image = await loadImage('images/vermeer.jpg');
  imageBrightness = getImageBrightness(image);
  return ({ context, width, height }) => {
    let x, y, ix, iy, idx, lineWidth;
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

        lineWidth = mapRange(imageBrightness[idx], 0, 255, 1, pixelSize * 0.25, true);

        context.beginPath();
        context.moveTo(x, y + pixelSize);
        context.lineTo(x + pixelSize, y);
        context.lineWidth = lineWidth;
        context.stroke();
      }
    }
  };
};

canvasSketch(sketch, settings);
