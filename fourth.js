const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'fourth'
};

const numLines = 16;

const colors = [
  '#FF00FF',
  '#00FFFF',
  '#FFFF00',
  '#7D55C7'
];

const sketch = () => {
  return ({ context, width, height }) => {
    const radius = width / 3;
    const lineWidth = 2 * radius / numLines;

    context.globalCompositeOperation = 'multiply';

    context.save();
    
    context.beginPath();
    context.translate(width / 3, height / 3)
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.clip();
    context.strokeStyle = colors[0];
    for (let i = 0; i < numLines; i++) {
      context.beginPath();
      context.moveTo(-radius, i * lineWidth + lineWidth * 0.5 - radius);
      context.lineTo(radius, i * lineWidth + lineWidth * 0.5 - radius);
      context.lineWidth = math.mapRange(i, 0, numLines - 1, lineWidth, 1);
      context.stroke();
    }
    
    context.restore();


    context.save();

    context.beginPath();
    context.translate(2 * width / 3, height / 3);
    context.rotate(Math.PI * 0.5);
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.clip();
    context.strokeStyle = colors[1];
    for (let i = 0; i < numLines; i++) {
      context.beginPath();
      context.moveTo(-radius, i * lineWidth + lineWidth * 0.5 - radius);
      context.lineTo(radius, i * lineWidth + lineWidth * 0.5 - radius);
      context.lineWidth = math.mapRange(i, 0, numLines - 1, lineWidth, 1);
      context.stroke();
    }

    context.restore();

    context.save();

    context.beginPath();
    context.translate(width / 3, 2 * height / 3);
    context.rotate(-Math.PI * 0.5);
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.clip();
    context.strokeStyle = colors[2];
    for (let i = 0; i < numLines; i++) {
      context.beginPath();
      context.moveTo(-radius, i * lineWidth + lineWidth * 0.5 - radius);
      context.lineTo(radius, i * lineWidth + lineWidth * 0.5 - radius);
      context.lineWidth = math.mapRange(i, 0, numLines - 1, lineWidth, 1);
      context.stroke();
    }

    context.restore();

    context.save();

    context.beginPath();
    context.translate(2* width / 3, 2 * height / 3);
    context.rotate(Math.PI);
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.clip();
    context.strokeStyle = colors[3];
    for (let i = 0; i < numLines; i++) {
      context.beginPath();
      context.moveTo(-radius, i * lineWidth + lineWidth * 0.5 - radius);
      context.lineTo(radius, i * lineWidth + lineWidth * 0.5 - radius);
      context.lineWidth = math.mapRange(i, 0, numLines - 1, lineWidth, 1);
      context.stroke();
    }

    context.restore();

    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
