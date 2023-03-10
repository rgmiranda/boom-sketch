const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { getRandomSeed } = require('canvas-sketch-util/random');
const { loadImage, getImageBrightness } = require('../images')

const cvWidth = cvHeight = 1080;

const pixelSize = 10;
const circles = Math.ceil(Math.SQRT2 * cvWidth * 0.5) / pixelSize;
const arcLength = Math.PI;
const name = `spiral-${getRandomSeed()}`;

let image, imageBrightness;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  name
};

const sketch = async () => {
  image = await loadImage('images/gioconda.jpg');
  imageBrightness = getImageBrightness(image);
  return ({ context, width, height }) => {
    const cx = width * 0.5;
    const cy = height * 0.5;

    let x, y, ix, iy, idx, phi, mphi, arcs, radius, perimeter;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'white';

    for (let i = 1; i <= circles; i++) {
      radius = i * pixelSize;
      perimeter =  2 * Math.PI * radius;
      arcs = Math.round(perimeter / arcLength);

      phi = (Math.PI * 2) / arcs;

      for (let j = 0; j < arcs; j++) {
        mphi = (2 * j + 1) * phi * 0.5;
        y = Math.floor(Math.sin(mphi) * radius) + cx;
        x = Math.floor(Math.cos(mphi) * radius) + cy;
        ix = Math.floor(mapRange(x, 0, width, 0, image.width));
        iy = Math.floor(mapRange(y, 0, height, 0, image.height));
        idx = iy * image.width + ix;

        context.lineWidth = mapRange(imageBrightness[idx], 0, 255, 1, pixelSize * 0.5, true);
        context.beginPath();
        context.arc(cx, cy, radius, j * phi, (j + 1) * phi);
        context.stroke();
      }
    }
  };
};

canvasSketch(sketch, settings);
