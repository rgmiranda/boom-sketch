const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const risoColors = require('riso-colors');

const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `cut-${seed}`
};
const text = 'M';
const fontStyle = 'sans-serif';
const m = -1;
const splitSize = 150;

let colors;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { string } fontStyle 
 * @param { string } text 
 * @param { number } width 
 * @param { number } height 
 */
const drawText = (context, fontStyle, text, width, height) => {
  /** @type { TextMetrics } */
  let mtext;

  let mx, my, mw, mh;

  context.fillStyle = random.pick(colors);

  context.font = `bold ${width}px ${fontStyle}`;

  mtext = context.measureText(text);
  mw = mtext.width;
  mh = mtext.actualBoundingBoxAscent + mtext.actualBoundingBoxDescent;
  my = (height + mh) * 0.5;
  mx = (width - mw) * 0.5;
  context.fillText(text, mx, my);
};

const sketch = () => {
  return ({ context, width, height }) => {

    const cvImage = document.createElement('canvas');
    cvImage.width = width;
    cvImage.height = height;
    const ctx = cvImage.getContext('2d');

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.shadowColor = 'black';
    context.shadowBlur = 16;
    context.shadowOffsetX = -8;
    context.shadowOffsetY = -8;

    random.setSeed(seed);
    colors = [
      random.pick(risoColors).hex,
      random.pick(risoColors).hex,
      random.pick(risoColors).hex,
      random.pick(risoColors).hex,
      random.pick(risoColors).hex,
      random.pick(risoColors).hex,
      random.pick(risoColors).hex,
    ];
    let offset = splitSize;
    while (width * m + offset < height) {
      const tx = random.range(25, 50);
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, offset);
      ctx.lineTo(width, width * m + offset);
      ctx.lineTo(width, width * m + offset + splitSize);
      ctx.lineTo(0, offset + splitSize);
      ctx.closePath();
      ctx.clip();

      ctx.translate(tx, m * tx);

      drawText(ctx, fontStyle, text, width, height);

      ctx.restore();
      offset += splitSize;

      context.drawImage(cvImage, 0, 0);
    }
  };
};

canvasSketch(sketch, settings);
