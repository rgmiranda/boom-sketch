const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'windmill',
  fps: 60
};

const noiseFreq = 0.01;
const noiseAmp = 0.05;

const colors = [
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#99AAFF',
  '#0000FF',
  '#4B0082',
  '#9400D3',
];

const sketch = () => {

  let millAngle = 0;
  return ({ context, width, height, frame }) => {

    millAngle += random.noise1D(frame, noiseFreq, noiseAmp) + noiseAmp * 0.5;
    const radius = width * 0.35;

    context.clearRect(0, 0, width, height);
    context.save();

    context.translate(width * 0.5, height * 0.5);
    context.rotate(millAngle);
    const angle = Math.PI * 2 / colors.length;
    colors.forEach((c, i) => {
      context.rotate(angle);
      context.fillStyle = c;
      context.globalCompositeOperation = 'destination-over'
      context.fillRect(0, 0, radius, radius);
      
      if (i === colors.length - 1) {
        context.globalCompositeOperation = 'source-over'
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, radius);
        context.lineTo(radius, radius);
        context.closePath();
        context.fill();
      }
    });

    context.restore();
    
    context.globalCompositeOperation = 'destination-over'
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
