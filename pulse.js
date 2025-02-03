const canvasSketch = require('canvas-sketch');
const { math, random } = require('canvas-sketch-util');

const rippleSpan = 1;

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'pulse'
};

class Ripple {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.maxRadius = 300;
    this.speed = 5;
  }

  get isActive() {
    return this.r < this.maxRadius;
  }

  update() {
    this.r += this.speed;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    const lineWidth = math.mapRange(this.r, 0, this.maxRadius, 3, 0.1, true);
    context.lineWidth = lineWidth;
    context.strokeStyle = 'white';
    context.beginPath();
    context.ellipse(this.x, this.y, this.r, this.r * 0.15 / 0.35, 0, 0, Math.PI * 2);
    //context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    context.stroke();
  }
}

const sketch = ({ width, height }) => {
  let ripples = [];
  let angle = 0;
  let totalDelta = 0;
  return ({ context, deltaTime }) => {
    totalDelta += deltaTime;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    if (totalDelta > rippleSpan) {
      totalDelta -= rippleSpan;
      ripples.push(new Ripple(width * 0.5 + Math.cos(angle) * width * 0.35, width * 0.5 + Math.sin(angle) * height * 0.15));
      angle += Math.PI * 0.25;
    }

    ripples.forEach(ripple =>  {
      ripple.update();
      ripple.draw(context);
    });
    ripples = ripples.filter(ripple => ripple.isActive);
  };
};

canvasSketch(sketch, settings);
