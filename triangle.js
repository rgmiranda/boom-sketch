const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

class Parallelogram {
  constructor ({ x, y, width, height, angle }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.rx = Math.cos(angle) * width;
    this.ry = Math.sin(angle) * width;
  }

  draw(context) {

    context.save();
    context.translate(this.x - this.rx * 0.5, this.y - ( this.ry + this.height ) * 0.5);

    const color = Math.floor(Math.abs(Math.cos(this.angle)) * 255);

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.rx, this.ry);
    context.lineTo(this.rx, this.ry + this.height);
    context.lineTo(0, this.height);
    context.closePath();
    context.stroke();

    context.restore();
  }
}

let angle = 0;
const angleStep = 0.01;

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const r = new Parallelogram({ 
      x: width * 0.5,
      y: height * 0.5,
      width: width * 0.4,
      height: height * 0.1,
      angle
    });
    r.draw(context);

    angle += angleStep;

  };
};

canvasSketch(sketch, settings);
