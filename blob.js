const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { rangeFloor, noise2D, noise3D, getRandomSeed } = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `blob-${getRandomSeed()}`
};
const bg = 'black';
const circles = 16;
const noiseScale = 0.0015;
const noiseAmp = 30;
const waveScale = 0.0125;
const waveAmp = 50;

const sketch = ({ width, height }) => {
  const minRadius = Math.min(width, height) * 0.1;
  const maxRadius = Math.min(width, height) * 0.4;
  return ({ context, width, height, frame }) => {
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    let offset, x, y;

    context.strokeStyle = 'white';
    context.lineWidth = 2;

    for (j = 0; j < circles; j++) {
      const radius = mapRange(j, 0, circles - 1, minRadius, maxRadius);
      const angle = Math.PI / ( 2 * radius);
      context.save();
      context.translate(width * 0.5, height * 0.5);
      context.beginPath();
      for (let i = 0; i < 4 * radius; i++) {
        x = Math.cos(angle * i) * radius;
        y = Math.sin(angle * i) * radius;
        offset = noise3D(x, y, frame * 10, noiseScale, noiseAmp) + Math.sin((radius + frame * 10) * waveScale) * waveAmp;
        context.rotate(angle);
        context.arc(0, 0, radius + offset, 0, angle);
      }
      context.closePath();
      context.stroke();
      context.restore();
    }
  };
    
};

canvasSketch(sketch, settings);
