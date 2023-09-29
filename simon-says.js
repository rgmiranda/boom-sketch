const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'simon-says',
  animate: true,
};
const numCircles = 12;
const lineWidth = 25;
const arcPadding = 50;
const colorSet = [
  createColormap({
    colormap: [ { index: 0, rgb: [255, 255, 0] }, { index:1, rgb: [0, 0, 0] } ],
    nshades: numCircles,
  }),
  createColormap({
    colormap: [ { index: 0, rgb: [66, 66, 255] }, { index:1, rgb: [0, 0, 0] } ],
    nshades: numCircles,
  }),
  createColormap({
    colormap: [ { index: 0, rgb: [66, 255, 66] }, { index:1, rgb: [0, 0, 0] } ],
    nshades: numCircles,
  }),
  createColormap({
    colormap: [ { index: 0, rgb: [255, 66, 66] }, { index:1, rgb: [0, 0, 0] } ],
    nshades: numCircles,
  }),
];

const sketch = () => {
  return ({ context, width, height, frame }) => {
    const maxRadius = width * 0.48;
    const minRadius = width * 0.1;
    const circlePadding = (maxRadius - minRadius) / numCircles;
    const arcLength = Math.PI * 2 / (colorSet.length);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    context.lineWidth  = lineWidth;
    context.lineCap = 'round';
    for (let j = 0; j < numCircles; j++) {
      context.save();
      context.rotate(Math.sin((frame - j) * 0.1) * Math.PI);
      //context.rotate((frame - j) * 0.05 * Math.PI);
      colorSet.forEach(colors => {
        context.strokeStyle = colors[j];
        const radius = circlePadding * j + minRadius;
        const paddingOffset = arcPadding / radius;
        context.beginPath();
        context.arc(0, 0, radius, 0, arcLength - paddingOffset);
        context.stroke();
        context.rotate(arcLength);
      });
      context.restore();
    };
  };
};

canvasSketch(sketch, settings);
