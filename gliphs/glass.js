const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `glass-${random.getRandomSeed()}`
};

const text = 'G';
const fontSize = '1080';
const fontStyle = 'serif'

/**
 * @param { CanvasRenderingContext2D } context
 * @param { string } text
 * @param { string } fontSize
 * @param { string } fontStyle
 * @param { number } width
 * @param { number } height
 */
function drawText(context, text, fontSize, fontStyle, width, height) {
  /** @type { TextMetrics } */
  let mtext

  let mx, my, mw, mh;

  console.log(`${fontSize}px ${fontStyle}`);
  context.font = `${fontSize}px ${fontStyle}`;
  context.fillStyle = 'white';

  mtext = context.measureText(text);
  mw = mtext.width;
  mh = mtext.actualBoundingBoxAscent + mtext.actualBoundingBoxDescent;
  my = (height + mh) * 0.5;
  mx = (width - mw) * 0.5;
  context.fillText(text, mx, my);
}

class Glass {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.x = Math.floor(Math.random() * width);
    this.y = Math.floor(Math.random() * height);
    this.size = Math.floor(Math.random() * 100) + 400;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {

    context.save();

    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.closePath();
    context.lineWidth = 10;
    context.strokeStyle = '#666666';
    context.stroke();

    context.clip();
    context.fillStyle = 'black';
    context.fillRect(0, 0, this.width, this.height);
    drawText(context, text, fontSize, fontStyle, this.width, this.height);

    context.restore();
  }
}

const sketch = ({ width, height }) => {
  const glass = new Glass(width, height)
  return ({ context, width, height }) => {
    context.save();
    context.fillStyle = 'black';
    context.filter = 'blur(50px)';
    context.fillRect(-100, -100, width + 200, height + 200);
    drawText(context, text, fontSize, fontStyle, width, height);
    context.restore();
    glass.draw(context);
  };
};

canvasSketch(sketch, settings);
