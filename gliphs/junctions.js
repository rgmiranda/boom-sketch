const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'n-junctions'
};

let text = 'N';
const pixelSize = 54;


/**
 * @param { number } width 
 * @param { number } height 
 * @returns { ImageData }
 */
function getGliphImageData(text, fontStyle, width, height) {
  /** @type { TextMetrics } */
  let mtext

  let mx, my, mw, mh;

  /** @type { HTMLCanvasElement } */
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  /** @type { CanvasRenderingContext2D } */
  const context = canvas.getContext('2d');
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  context.font = fontStyle;
  context.fillStyle = 'white';

  mtext = context.measureText(text);
  mw = mtext.width;
  mh = mtext.actualBoundingBoxAscent + mtext.actualBoundingBoxDescent;
  my = (height + mh) * 0.5;
  mx = (width - mw) * 0.5;
  context.fillText(text, mx, my);
  return context.getImageData(0, 0, width, height);
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } pixelSize 
 * @param { ImageData } gliphImageData 
 */
const drawDiamonds = (context, width, height, pixelSize, gliphImageData) => {
  context.fillStyle = 'lightgray';
  context.fillRect(0, 0, width, height);

  console.log(gliphImageData.width, gliphImageData.height);
  
  context.fillStyle = 'gray';
  for(let y = 0; y < height + pixelSize * 0.5; y += pixelSize) {
    const iy = Math.floor(math.mapRange(y, 0, height, 0, gliphImageData.height - 1, true));
    for(let x = 0; x < width + pixelSize * 0.5; x += pixelSize) {
      const ix = Math.floor(math.mapRange(x, 0, width, 0, gliphImageData.width - 1, true));

      const idx = 4 * (iy * gliphImageData.width + ix);
      const sw = gliphImageData.data[idx] !== 0;


      context.beginPath();
      context.moveTo(x, y - pixelSize * 0.5);
      context.lineTo(x + pixelSize * 0.5, y);
      context.lineTo(x, y + pixelSize * 0.5);
      context.lineTo(x - pixelSize * 0.5, y);
      context.closePath();
      context.fillStyle = 'gray';
      context.fill();

      context.beginPath();
      context.arc(x, y - pixelSize * 0.5, pixelSize * 0.075, 0, Math.PI * 2);
      context.fillStyle = sw ? 'black' : 'white';
      context.fill();
      
      context.beginPath();
      context.arc(x - pixelSize * 0.5, y, pixelSize * 0.075, 0, Math.PI * 2);
      context.fillStyle = sw ? 'white' : 'black';
      context.fill();


    }
  }
};

const sketch = ({ width, height }) => {

  const fontSize = width / pixelSize;
  const fontStyle = `bold ${fontSize}px sans-serif`;
  const gliphImageData = getGliphImageData(text, fontStyle, fontSize, fontSize);

  return ({ context }) => {
    drawDiamonds(context, width, height, pixelSize, gliphImageData);
  };
};

canvasSketch(sketch, settings);
