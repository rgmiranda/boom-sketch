const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { loadImage, getImageBrightness } = require('../images')

const cvWidth = cvHeight = 1080;

const pixelSize = 10;
const rows = cvHeight / pixelSize;
const cols = cvWidth / pixelSize;

let image, imageBrightness;

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

const sketch = async () => {
  image = await loadImage('images/profile.jpg');
  imageBrightness = getImageBrightness(image);
  return ({ context, width, height }) => {
    let x, y, ix, iy, idx, b;
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
        b = mapRange(imageBrightness[idx], 0, 255, Math.PI * 2, 0, true);

        context.save();
        context.translate(x + pixelSize * 0.5, y + pixelSize * 0.5);
        context.rotate(b);
        context.fillRect(-pixelSize * 0.5, -pixelSize * 0.5, pixelSize, pixelSize);
        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings);
