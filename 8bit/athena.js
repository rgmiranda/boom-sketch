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
  image = await loadImage('images/statue.png');
  imageBrightness = getImageBrightness(image);
  return ({ context, width, height }) => {
    let x, y, ix, iy, idx, r, c;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        x = i * pixelSize;
        y = j *  pixelSize;
        ix = Math.floor(mapRange(x, 0, width, 0, image.width));
        iy = Math.floor(mapRange(y, 0, height, 0, image.height));
        idx = iy * image.width + ix;
        r = mapRange(imageBrightness[idx], 0, 255, 2, pixelSize * 0.6, true);
        c = mapRange(imageBrightness[idx], 0, 255, 64, 255, true)
        
        context.beginPath();
        context.fillStyle = `rgb(${c}, ${c}, ${c})`;
        context.arc(x + pixelSize * 0.5, y + pixelSize * 0.5, r, 0, Math.PI * 2);
        context.fill();
      }
    }
  };
};

canvasSketch(sketch, settings);
