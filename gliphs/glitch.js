const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const seed = random.getRandomSeed();
const settings = {
  dimensions: [1080, 1080],
  name: `glitch-${seed}`
};

const text = 'I';
const fontSize = 1500;
const fontStyle = 'bold serif';
const numGlitches = 10;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } text 
 * @param { number } fontSize 
 * @param { number } fontStyle 
 * @param { number } width 
 * @param { number } height 
 */
function drawText(context, text, fontSize, fontStyle, width, height)
{
  /** @type { TextMetrics } */
  let mtext

  let mx, my, mw, mh;

  context.font = `${fontSize}px ${fontStyle}`;

  mtext = context.measureText(text);
  mw = mtext.width;
  mh = mtext.actualBoundingBoxAscent + mtext.actualBoundingBoxDescent;
  my = (height + mh) * 0.5;
  mx = (width - mw) * 0.5;
  context.fillText(text, mx + random.rangeFloor(-50, 50), my + random.rangeFloor(-50, 50));
}

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } text 
 * @param { number } fontSize 
 * @param { number } fontStyle 
 * @param { number } width 
 * @param { number } height 
 */
function drawGlitch(context, text, fontSize, fontStyle, width, height)
{
  context.save();
  context.globalCompositeOperation = 'multiply'
  context.fillStyle = '#ff00ff';
  drawText(context, text, fontSize, fontStyle, width, height);
  context.fillStyle = '#ffff00';
  drawText(context, text, fontSize, fontStyle, width, height);
  context.fillStyle = '#00ffff';
  drawText(context, text, fontSize, fontStyle, width, height);
  context.restore();
}

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.clearRect(0, 0, width, height);
    drawGlitch(context, text, fontSize, fontStyle, width, height);

    for (let i = 0; i < numGlitches; i++) {
      context.save();
      context.beginPath();
      context.rect(0, random.range(0, height), width, random.range(10, 30));
      context.clip();
      if (random.chance(0.5)) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);
        context.translate(random.rangeFloor(-250, 250), 0);
      }
      drawGlitch(context, text, fontSize, fontStyle, width, height);
      context.restore();
    }

    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
