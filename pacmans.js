const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `pacmans-${Date.now()}`
};
const noiseScale = 0.05;
const noiseAmp = Math.PI;
const res = 16;

const sketch = ({ width, height }) => {
  const pw = width / res;
  const ph = height / res;
  return ({ context, width, height, frame }) => {
    let x, y, angle;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    for (let i = 0; i < res; i++) {
      y = (i + 0.5) *  ph;
      for (let j = 0; j < res; j++) {
        angle = random.noise3D(i, j, frame * 0.2, noiseScale, noiseAmp);
        x = (j + 0.5) * pw;
        context.save();

        context.translate(x, y);
        context.rotate(angle);
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, pw * 0.5, angle + noiseAmp, Math.PI * 2);
        context.closePath();
        context.fillStyle = '#ffe737';
        context.fill();

        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings);
