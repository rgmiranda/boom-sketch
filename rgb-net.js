const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'rgb-net'
};

const colors = [
  'magenta',
  'yellow',
  'turquoise'
];
const numLines = 48;

const sketch = () => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    const radius = width * 0.5;
    const angle = 2 * Math.PI / colors.length;
    const bx = Math.cos(2 * Math.PI / 3) * radius;
    const by = Math.sin(2 * Math.PI / 3) * radius
    const linePad =  2 * Math.abs(Math.sin(2 * Math.PI / 3) * radius) / numLines;

    context.globalCompositeOperation = 'lighter';
    context.translate(width * 0.5, height * 0.6);
    context.rotate(-Math.PI * 0.5);
    context.lineWidth = 2;
    for (let i = 0; i < numLines + 1; i++) {
    colors.forEach( color => {
      context.strokeStyle = color;
        /*context.save();
        context.beginPath();
        context.moveTo(bx, by);
        context.lineTo(0, 0);
        context.lineTo(bx, -by);
        context.closePath();
        context.clip();*/

        context.beginPath();
        context.moveTo(radius, 0);
        context.quadraticCurveTo(0, 0, bx, by - i * linePad);
        context.stroke();
        //context.restore();
        context.rotate(angle);
      });
    }

    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'black';
    context.fillRect(-width, -height, 2 * width, 2 * height);
  };
};

canvasSketch(sketch, settings);
