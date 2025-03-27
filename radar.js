const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'radar',
  animate: true,
};

const speed = 0.008;

const colors = createColormap({
  nshades: 11,
  colormap: 'rainbow-soft',
}).slice(1).reverse();

/** @type { { pos: number, dir: number }[] } */
const angles = Array(colors.length).fill(0).map((_, i, a) => ({
  pos: 2 * Math.random() *  i / colors.length,
  dir: 1
}));

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } angle 
 * @param { number } radius 
 * @param { string } color 
 */
const drawCake = (context, width, height, angle, radius, color) => {
  context.save();

  context.translate(width * 0.5, height * 0.5);
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, -radius);
  context.arc(0, 0, radius, -0.5 * Math.PI, angle - 0.5 * Math.PI);
  context.lineTo(0, 0);
  context.stroke();

  context.restore();
};

const sketch = ({ width, height }) => {
  const radiusPad = 0.45 * width / (colors.length + 1);
  return ({ context }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
  
    colors.forEach((color, i) => {
      const { pos, dir } = angles[i];
      const angle = eases.quintInOut(pos) * 2 * Math.PI;
      drawCake(context, width, height, angle, radiusPad * (colors.length - i + 1), color);
      angles[i].pos += dir * speed;
      if (angles[i].pos < 0) {
        angles[i].dir = 1;
        angles[i].pos = 0;
      } else if (angles[i].pos > 1) {
        angles[i].dir = -1;
        angles[i].pos = 1;
      }
    });

  };
};

canvasSketch(sketch, settings);
