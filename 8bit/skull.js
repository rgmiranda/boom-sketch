const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { loadImage, getImageBrightness } = require('../images');
const random = require('canvas-sketch-util/random');

const cvWidth = cvHeight = 1080;

const pixelSize = 5;
const subpixelSize = 2;
const subpixelCount = Math.floor(pixelSize / subpixelSize);
const rows = cvHeight / pixelSize;
const cols = cvWidth / pixelSize;

const pixelColor = 'white';

let image, imageBrightness;

const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 * @param { number } brightness 
 */
const drawCircle = (context, x, y, brightness) => {
  const r = mapRange(brightness, 0, 255, 2, pixelSize * 0.6, true);
  const c = mapRange(brightness, 0, 255, 0, 255, true)

  context.beginPath();
  context.fillStyle = `rgb(${c}, 0, 0)`;
  context.arc(x + pixelSize * 0.5, y + pixelSize * 0.5, r, 0, Math.PI * 2);
  context.fill();
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 * @param { number } brightness 
 */
const drawSubPixel = (context, x, y, brightness) => {
  const c = mapRange(brightness, 0, 255, 0.01, 0.9, true);
  context.fillStyle = pixelColor;

  for (let i = 0; i < subpixelCount; i++) {
    for (let j = 0; j < subpixelCount; j++) {
      if (random.chance(c)) {
        context.fillRect(x + i * subpixelSize, y + j * subpixelSize, subpixelSize, subpixelSize);
      }
    }
  }
};

const sketch = async () => {
  image = await loadImage('images/skull-800.jpg');
  imageBrightness = getImageBrightness(image);
  return ({ context, width, height }) => {
    let x, y, ix, iy, idx;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        x = i * pixelSize;
        y = j *  pixelSize;
        ix = Math.floor(mapRange(x, 0, width, 0, image.width));
        iy = Math.floor(mapRange(y, 0, height, 0, image.height));
        idx = iy * image.width + ix;
        drawCircle(context, x, y, imageBrightness[idx]);
      }
    }
  };
};

canvasSketch(sketch, settings);
