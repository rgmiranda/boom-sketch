const canvasSketch = require('canvas-sketch');
const { loadImage, getImageBrightness } = require('./images');
const { random } = require('canvas-sketch-util');
const { mapRange } = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'houssay'
};
const imageFile = 'houssay.jpg';
const numCircles = 4096 * 8;


/**
 * 
 * @param { Uint8ClampedArray } imageBrightness 
 * @returns { number[] }
 */
const getProbability = (imageBrightness) => {
  let acc = 0;
  const sum = imageBrightness.reduce((prev, val) => prev += (255 - val), 0);
  return imageBrightness.map(v => {
    acc += (255 - v) / sum;
    return acc;
  });
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { HTMLImageElement } image 
 * @param { number[] } probability 
 */
const drawCircle = (context, width, height, image, probability, imageBrightness) => {
  const p = random.value();
  const idx = probability.findIndex(v => p < v );
  const ix = idx % image.width;
  const iy = Math.floor(idx / image.width);
  const x = Math.floor(mapRange(ix, 0, image.width - 1, 0, width - 1, true));
  const y = Math.floor(mapRange(iy, 0, image.height - 1, 0, height - 1, true));
  const rx = width / image.width;
  const ry = height / image.height;
  const ox = random.range(0, rx) - rx * 0.5;
  const oy = random.range(0, ry) - ry * 0.5;

  const r = mapRange(imageBrightness[idx], 0, 255, 1, 15, true);
  const lw = mapRange(imageBrightness[idx], 0, 255, 2, 0.25, true);
  context.beginPath();
  context.arc(x + ox, y + oy, r, 0, Math.PI * 2);
  context.strokeStyle = 'black';
  context.lineWidth = lw;
  context.fillStyle = 'white';
  context.fill();
  context.stroke();
};

const sketch = async () => {

  const image = await loadImage(`images/${imageFile}`);
  const imageBrightness = getImageBrightness(image);
  const probability = getProbability(imageBrightness);

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    for (let i = 1; i < numCircles; i++) {
      drawCircle(context, width, height, image, probability, imageBrightness);
    }
  };
};

canvasSketch(sketch, settings);
