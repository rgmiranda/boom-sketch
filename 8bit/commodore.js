const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { loadImage, getImageBrightness } = require('../images')

const cvWidth = cvHeight = 1080;

const pixelSize = 20;
const rows = cvHeight / pixelSize;
const cols = cvWidth / pixelSize;

let image, imageBrightness;

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

const sketch = async () => {
  image = await loadImage('images/profile.jpg');
  imageBrightness = getImageBrightness(image);
  console.log(imageBrightness);
  return ({ context, width, height }) => {
    let x, y, ix, iy, idx, b;
    context.fillStyle = 'green';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        x = i * pixelSize;
        y = j *  pixelSize;
        ix = Math.floor(mapRange(x, 0, width, 0, image.width));
        iy = Math.floor(mapRange(y, 0, height, 0, image.height));
        idx = iy * image.width + ix;
        b = mapRange(imageBrightness[idx], 0, 200, pixelSize, 4, true);

        context.beginPath();
        context.moveTo(x, y + pixelSize - b * 0.5);
        context.lineTo(x, y + b * 0.5);
        context.lineTo(x + pixelSize, y + b * 0.5);
        context.lineTo(x + pixelSize, y + pixelSize - b * 0.5);
        context.closePath();
        context.fill();
      }
    }
  };
};

canvasSketch(sketch, settings);
