const canvasSketch = require('canvas-sketch');
const { mapRange, clamp } = require('canvas-sketch-util/math');
const { getRandomSeed, pick } = require('canvas-sketch-util/random');
const { loadImage, getImageBrightness } = require('../images')

const cvWidth = cvHeight = 1080;

const pixelSize = 15;
const rows = cvHeight / pixelSize;
const cols = cvWidth / pixelSize;
const name = `ascii-${getRandomSeed()}`;
const chars = [
  '·'.split(''),
  '-,\''.split(''),
  '*+/\\'.split('')
]

let image, imageBrightness;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name
};

const sketch = async () => {
  image = await loadImage('images/gioconda.jpg');
  imageBrightness = getImageBrightness(image);
  return ({ context, width, height }) => {
    let x, y, ix, iy, idx, char, brightness, fontSize;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        x = i * pixelSize;
        y = j *  pixelSize;
        ix = Math.floor(mapRange(x, 0, width, 0, image.width));
        iy = Math.floor(mapRange(y, 0, height, 0, image.height));
        idx = iy * image.width + ix;

        if (imageBrightness[idx] < 51) {
          char = pick(chars[0]);
        } else if (imageBrightness[idx] < 127) {
          char = pick(chars[1]);
        } else {
          char = pick(chars[2]);
        }
        brightness = Math.floor(clamp(imageBrightness[idx], 51, 255));
        fontSize = 1.75;

        context.font = `${fontSize * pixelSize}px monospace`;
        context.beginPath();
        context.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
        context.fillText(char, x, y + pixelSize);
      }
    }
  };
};

canvasSketch(sketch, settings);
