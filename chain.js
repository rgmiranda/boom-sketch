const canvasSketch = require('canvas-sketch');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'chain'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 * @param { number } radius 
 * @param { number } innerRadius 
 */
const drawLink = (context, x, y, radius, innerRadius) => {
  const numCircles = 64;
  const radiusPad = radius - innerRadius;
  const radiuses = Array(numCircles).fill(0).map((_, i, a) => {
    const prop = eases.circInOut(i / (a.length - 1));
    return innerRadius + radiusPad * prop; 
  });
  radiuses.forEach(r => {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.stroke();
  });
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 * @param { number } width 
 * @param { number } height 
 */
const drawOtherLink = (context, x, y, width, height) => {
  const numRects = 28;
  const rects = Array(numRects).fill(0).map((_, i, a) => {
    const prop = eases.circOut((i + 1) / a.length);
    return {
      w: width * prop,
      h: height * prop,
    }
  }).reverse();
  rects.forEach(({ w, h }, i) => {
    context.beginPath();
    context.roundRect(x - w * 0.5, y - h * 0.5, w, h, Math.min(w, h));
    context.fill();
    context.stroke();
  });
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawLink(context, width * 0.4, height * 0.5, width * 0.275, width * 0.1);
    drawOtherLink(context, width * 0.58, height * 0.5, width * 0.55, width * 0.19);
  };
};

canvasSketch(sketch, settings);
