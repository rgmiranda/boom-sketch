const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const seed = random.getRandomSeed();
random.setSeed(seed);
const settings = {
  dimensions: [ 1080, 1080 ],
  name: `rotation-${seed}`
};

let text = 'H';
const fontSize = 1500;
const fontStyle = 'bold serif';
const numArcs = 128;
const arcWidth = (1080 * Math.SQRT1_2) / numArcs;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } text 
 * @param { number } fontSize 
 * @param { number } fontStyle 
 * @param { number } width 
 * @param { number } height 
 */
function drawText(context, text, fontSize, fontStyle, width, height) {
  /** @type { TextMetrics } */
  let mtext

  let mx, my, mw, mh;

  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  context.font = `${fontSize}px ${fontStyle}`;
  context.fillStyle = 'white';

  mtext = context.measureText(text);
  mw = mtext.width;
  mh = mtext.actualBoundingBoxAscent + mtext.actualBoundingBoxDescent;
  my = (height + mh) * 0.5;
  mx = (width - mw) * 0.5;
  context.fillText(text, mx, my);
}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    for (let i = 0; i < numArcs; i++) {
      context.save();

      
      context.translate(width * 0.5, height * 0.5);
      context.beginPath();
      context.arc(0, 0, arcWidth * (numArcs - i), 0, Math.PI * 2);
      context.clip();
      if (random.chance(0.4)) {
        context.rotate(random.range(-Math.PI * 0.5, Math.PI * 0.5));
      }
      context.translate(- width * 0.5, - height * 0.5);
      drawText(context, text, fontSize, fontStyle, width, height);
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
