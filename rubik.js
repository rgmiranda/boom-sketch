const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `rubik-${seed}`
};

const xsize = 162;
const ysize = 81;
const colors = [
  '#FFFF00',
  '#29bf12',
  '#00a6fb',
  '#ef233c',
  '#f77f00',
  '#ffffff'
];

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawCube = (context, width, height) => {
  let offset = false;
  let x = 0;
  let y = -ysize * 0.5;
  while (y < height) {
    x = offset ? -0.5 * xsize : 0;

    while (x < width) {
      context.beginPath();
      context.moveTo(x, y + ysize * 0.5);
      context.lineTo(x + xsize * 0.5, y);
      context.lineTo(x + xsize, y + ysize * 0.5);
      context.lineTo(x + xsize * 0.5, y + ysize);
      context.closePath();
      context.fillStyle = random.pick(colors);
      context.fill();
      context.stroke();
      x += xsize;
    }

    offset = !offset;
    y += ysize * 0.5;
  }

  x = 2 * xsize;
  for (let i = 0; i < 3; i++) {
    y = (i + 10) * ysize * 0.5;
    for (let j = 0; j < 3; j++) {
      context.beginPath();
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + xsize * 0.5, y + ysize * 0.5);
      context.lineTo(x + xsize * 0.5, y + ysize * 1.5);
      context.lineTo(x, y + ysize);
      context.closePath();
      context.fillStyle = random.pick(colors);
      context.fill();
      context.stroke();
      y += ysize;
    }
    x += xsize * 0.5;
  }

  x = 3.5 * xsize;
  for (let i = 0; i < 3; i++) {
    y = (19 - i) * ysize * 0.5;
    for (let j = 0; j < 3; j++) {
      context.beginPath();
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + xsize * 0.5, y - ysize * 0.5);
      context.lineTo(x + xsize * 0.5, y - ysize * 1.5);
      context.lineTo(x, y - ysize);
      context.closePath();
      context.fillStyle = random.pick(colors);
      context.fill();
      context.stroke();
      y -= ysize;
    }
    x += xsize * 0.5;
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    drawCube(context, width, height);
  };
};

canvasSketch(sketch, settings);
