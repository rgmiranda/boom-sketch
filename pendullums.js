const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const pendullumConfig = {
  padding: Math.PI / 6,
  amplitude: Math.PI * 0.2,
  speed: 0.035,
};

class Pendullum {

  constructor({ offset, radius, color, size, amplitude, speed }) {
    this.radius = radius;
    this.offset = offset;
    this.speed = speed;
    this.color = color;
    this.size = size;
    this.amplitude = amplitude;
    this.x = 0;
    this.y = 0;
  }

  update() {
    const angle = Math.PI * 0.5 + Math.sin(this.offset) * this.amplitude;
    this.x = Math.cos(angle) * this.radius;
    this.y = Math.sin(angle) * this.radius;
    this.offset += this.speed;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();

    context.strokeStyle = 'white';
    context.lineWidth = 5;

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.x, this.y);
    context.stroke();

    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();

    context.restore();
  }
}

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  name: `pendullums`
};

const colors = [
  '#e81416',
  '#ffa500',
  '#faeb36',
  '#79c314',
  '#487de7',
  '#4b369d',
  '#70369d',
].reverse();

const sketch = ({ width }) => {
  const pendullums = colors.map((c, i) => new Pendullum({
    offset: i * pendullumConfig.padding,
    radius: width * 0.66,
    color: c,
    size: 75,
    amplitude: pendullumConfig.amplitude,
    speed: pendullumConfig.speed
  }));
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, 0);

    pendullums.forEach((p, i) => {
      context.filter = `blur(${ ( pendullums.length - i - 1 )}px)`;
      p.update();
      p.draw(context);
    });

  };
};

canvasSketch(sketch, settings);
