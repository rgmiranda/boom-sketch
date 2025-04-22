const canvasSketch = require('canvas-sketch');
const { color } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'hanoi'
};

const colors = createColormap({
  nshades: 12,
  colormap: 'greys'
});

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } cx 
 * @param { number } cy 
 * @param { number } c 
 * @param { number } radius 
 * @param { number } subradius 
 */
const drawDisc = (context, cx, cy, c, radius, subradius) => {
  context.save();

  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.fillStyle = c;
  context.fill();

  context.beginPath();
  context.rect(cx, cy - subradius, radius, subradius * 2);
  context.clip();

  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.fillStyle = '#00000080';
  context.fill();

  context.restore();
};

const sketch = ({ width, height }) => {
  const radiusPad = (width * 0.5) / colors.length;
  const cx = width * 0.5;
  const cy = height * 0.5;
  return ({ context }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    colors.forEach((c, i) => {
      const radius = radiusPad * (colors.length - i);
      const subrad = radiusPad * (colors.length - i - 1);
      drawDisc(context, cx, cy, c, radius, subrad);
    });
  };
};

canvasSketch(sketch, settings);
