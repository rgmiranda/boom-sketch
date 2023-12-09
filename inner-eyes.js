const canvasSketch = require('canvas-sketch');
const color = require('canvas-sketch-util/color');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `inner-eyes`
};

const colors = [
  '#ffadad',
  color.offsetHSL('#ffadad', 0, 0, -10).hex,
  '#ffd6a5',
  color.offsetHSL('#ffd6a5', 0, 0, -10).hex,
  '#fdffb6',
  color.offsetHSL('#fdffb6', 0, 0, -10).hex,
  '#caffbf',
  color.offsetHSL('#caffbf', 0, 0, -10).hex,
  '#9bf6ff',
  color.offsetHSL('#9bf6ff', 0, 0, -10).hex,
  '#a0c4ff',
  color.offsetHSL('#a0c4ff', 0, 0, -10).hex,
  '#bdb2ff',
  color.offsetHSL('#bdb2ff', 0, 0, -10).hex,
  '#ffc6ff',
  color.offsetHSL('#ffc6ff', 0, 0, -10).hex,
];

const numCircles = 8;
const ratio = 0.7;

const sketch = () => {
  return ({ context, width, height }) => {
    let xsize = width * 0.48;
    let ysize = height * 0.48;
    let vertical = true;
    context.fillStyle = '#F4F0E8';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);

    for (let i = 0; i < numCircles; i++) {

      context.beginPath();
      context.ellipse(0, 0, xsize, ysize, 0, 0, Math.PI * 2);
      context.fillStyle = colors[i * 2];
      context.fill();
      
      if (vertical) {
        ysize *= ratio;
      } else {
        xsize *= ratio;
      }
      
      context.beginPath();
      context.ellipse(0, 0, xsize, ysize, 0, 0, Math.PI * 2);
      context.fillStyle = colors[i * 2 + 1];
      context.fill();
      
      if (vertical) {
        xsize *= ratio;
      } else {
        ysize *= ratio;
      }
      
      vertical = !vertical;
    }

  };
};

canvasSketch(sketch, settings);
