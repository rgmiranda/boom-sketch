const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const c = 0.00, gravity = 0.2;
const numPendullums = 12;
const minRadius = 100;
const maxRadius = 500;
const pendullumWidth = (maxRadius - minRadius) / numPendullums;

class Pendullum {

  constructor(angle, radius, color, lineWidth) {
    this.radius = radius;
    this.angle = angle;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;
    this.color = color;
    this.lineWidth = lineWidth;
  }

  drag() {
    const drag = (-this.angularVelocity) * Math.abs(this.angularVelocity) * c;
    this.angularAcceleration += drag;
  }

  update() {
    this.angularAcceleration = -Math.sin(this.angle) * gravity / this.radius;
    this.drag();
    this.angularVelocity += this.angularAcceleration;
    this.angle += this.angularVelocity;
    this.angularAcceleration = 0;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context, cvWidth, cvHeight) {
    context.save();
    context.translate(cvWidth * 0.5, cvHeight * 0.5);
    context.rotate(Math.PI * 0.5 + this.angle);
    context.beginPath();
    context.arc(0, 0, this.radius, -Math.PI * 0.25, Math.PI * 0.25);
    context.lineWidth = this.lineWidth;
    context.lineCap = 'round'
    context.strokeStyle = this.color;
    context.stroke();
    context.restore();
  }
}

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  name: `pendullums`
};

const colors = createColormap({
  colormap: 'rainbow',
  nshades: numPendullums,
})

const sketch = () => {
  const pendullums = Array(numPendullums).fill(0).map((e, i) => new Pendullum(random.range(-Math.PI * 0.125, Math.PI * 0.125) + Math.PI, (i + 1) * pendullumWidth, colors[i], pendullumWidth));
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    pendullums.forEach(p => {
      p.update();
      p.draw(context, width, height);
    });

  };
};

canvasSketch(sketch, settings);
