const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'checkers'
};

const baseSpeed = 0.5;
const acc = 0.05;
const lineFrame = 8;

class Line {

  /**
   * 
   * @param { number } width 
   * @param { number } height 
   */
  constructor (width, height) {
    this.width = width;
    this.height = height;

    this.pos = 0;
    this.speed = baseSpeed;
  }

  /**
   * @returns { boolean }
   */
  get active() {
    return this.pos < Math.max(this.width * 0.65, this.height * 0.65);
  }

  update() {
    if (!this.active) {
      return;
    }
    this.pos += this.speed;
    this.speed += acc;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    if (!this.active) {
      return;
      }
    ctx.lineWidth = this.speed * 7.5;

    ctx.beginPath();
    ctx.moveTo(0, this.height * 0.5 + this.pos);
    ctx.lineTo(this.width, this.height * 0.5 + this.pos);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, this.height * 0.5 - this.pos);
    ctx.lineTo(this.width, this.height * 0.5 - this.pos);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.width * 0.5 - this.pos, 0);
    ctx.lineTo(this.width * 0.5 - this.pos, this.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.width * 0.5 + this.pos, 0);
    ctx.lineTo(this.width * 0.5 + this.pos, this.height);
    ctx.stroke();
  }
}

const sketch = () => {

  /** @type { Line[] } */
  let lines = [];

  let pf = 0;
  return ({ context, width, height, frame }) => {
    if ((frame % lineFrame) === 0 && pf !== frame) {
      lines.push(new Line(width, height));
    }
    pf = frame;
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'xor';
    context.strokeStyle = 'black';
    lines.forEach(l => {
      l.update();
      l.draw(context);
      });
    lines = lines.filter(l => l.active);
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
