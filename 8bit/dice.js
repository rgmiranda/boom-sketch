const canvasSketch = require('canvas-sketch');
const { mapRange, clamp } = require('canvas-sketch-util/math');
require('canvas-sketch-util/random');
const { loadImage, getImageBrightness } = require('../images');
const eases = require('eases');

const cvWidth = cvHeight = 1080;
const fromCols = 1;
const toCols = 92;

let rows = cols = fromCols;
let pixelSize = cvWidth / rows;
const name = `dice`;

const bg = 'white';
const dieColor = 'black';
const pinColor = 'white';
const imageFile = 'girl-1.jpg';

let image, imageBrightness;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name,
  animate: true,
  fps: 12,
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } pins 
 * @param { number } x 
 * @param { number } y 
 * @param { number } w 
 * @param { number } h 
 */
const drawDie = (context, pins, x, y, w, h) => {
  context.save();

  const r = w * 0.15;
  const pr = w * 0.08   ;

  context.translate(x, y);

  context.beginPath();
  context.moveTo(r, 0);
  context.arcTo(w, 0, w, r, r);
  context.arcTo(w, h, w - r, h, r);
  context.arcTo(0, h, 0, h - r, r);
  context.arcTo(0, 0, r, 0, r);
  context.closePath();
  context.fillStyle = dieColor;
  context.fill();
  context.strokeStyle = bg;
  //context.stroke();

  switch (pins) {
    case 1:
      context.beginPath();
      context.arc(w * 0.5, h * 0.5, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();
      break;
    case 2:
      context.beginPath();
      context.arc(w * 0.3, h * 0.3, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.7, h * 0.7, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();
      break;
    case 3:
      context.beginPath();
      context.arc(w * 0.3, h * 0.3, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.5, h * 0.5, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.7, h * 0.7, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();
      break;
    case 4:
      context.beginPath();
      context.arc(w * 0.3, h * 0.3, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.3, h * 0.7, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.7, h * 0.3, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.7, h * 0.7, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();
      break;
    case 5:
      context.beginPath();
      context.arc(w * 0.3, h * 0.3, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.3, h * 0.7, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.7, h * 0.3, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.7, h * 0.7, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.5, h * 0.5, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();
      break;
    case 6:
      context.beginPath();
      context.arc(w * 0.3, h * 0.3, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.3, h * 0.5, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.3, h * 0.7, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.7, h * 0.3, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.7, h * 0.5, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();

      context.beginPath();
      context.arc(w * 0.7, h * 0.7, pr, 0, Math.PI * 2);
      context.fillStyle = pinColor;
      context.fill();
      break;
  
    default:
      break;
  }

  context.restore();
}

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { Uint8ClampedArray } imageBrightness 
 */
const draw = (context, width, height, imageBrightness) => {
  let x, y, ix, iy, idx, brightness, pins;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      x = i * pixelSize;
      y = j * pixelSize;
      ix = Math.floor(mapRange(x, 0, width, 0, image.width));
      iy = Math.floor(mapRange(y, 0, height, 0, image.height));
      idx = iy * image.width + ix;

      brightness = imageBrightness[idx];
      pins = Math.round(mapRange(brightness, 0, 255, 1, 6, true));

      drawDie(context, pins, x, y, pixelSize, pixelSize);
    }
  }
};

const addListeners = () => {
  window.addEventListener('click', () => {
    if (!sketchManager) {
      return;
    }
    if (sketchManager.props.playing) {
      sketchManager.pause();
    } else {
      sketchManager.play();
    }
  });
}

const sketch = async () => {
  addListeners();
  image = await loadImage(`images/${imageFile}`);
  imageBrightness = getImageBrightness(image);
  return ({ context, width, height, frame }) => {
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);
    draw(context, width, height, imageBrightness);
    cols = rows = Math.floor(eases.circIn(clamp(frame, fromCols, toCols) / toCols) * toCols + 1);
    pixelSize = width / cols;
  };
};

canvasSketch(sketch, settings).then(manager => {
  sketchManager = manager;
  sketchManager.pause();
});
