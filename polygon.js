const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const freq = 0.01;
const amp = Math.PI * 0.5;
const numSides = 5;
const speed = 5;
const anglePad = Math.PI / (numSides * 8);
/*const colors = [
  '#FF0000',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#FF00FF',
];*/

const colors = createColormap({
  colormap: 'jet',
  nshades: 12,
})

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `polygon-${numSides}`
};

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } cx 
 * @param { number } cy 
 * @param { number } size 
 * @param { number } frame 
 */
const drawHexagons = (ctx, cx, cy, size, frame) => {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = 'lighten';
  ctx.lineWidth = size * 0.025;
  colors.forEach((c, i) => {
    let offsetAngle;
    const polygonAngle = 2 * Math.PI / numSides;
    offsetAngle = Math.sin(freq * frame * speed + i * anglePad) * amp;
    ctx.save();
    ctx.rotate(offsetAngle);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    for (let i = 0; i < numSides; i++) {
      ctx.rotate(polygonAngle);
      ctx.lineTo(0, -size);
    }
    ctx.closePath();
    ctx.strokeStyle = c;
    ctx.stroke();
    ctx.restore();
  });
  ctx.restore();
};

const sketch = ({ width, height, canvas }) => {

  return ({ context, width, height, frame }) => {
    context.clearRect(0, 0, width, height);
    drawHexagons(context, width * 0.5, height * 0.5, width * 0.48, frame);
    
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
