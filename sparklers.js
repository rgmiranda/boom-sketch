const canvasSketch = require('canvas-sketch');
const { Vector } = require('./calc');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'sparkler'
};

const colors = [
  '#ffda0a',
  '#ffd819',
  '#ffdd32',
  '#ffe14c',
  '#ffe566',
  '#ffee99',
  '#fff2b2',
  '#fff6cc',
  '#fffae5',
  '#f20089',
  '#e500a4',
  '#db00b6',
  '#d100d1',
  '#ff006d',
  /*
  '#b100e8',
  '#a100f2',
  '#8900f2',
  '#6a00f4',
  '#2d00f7',*/
];

const drag = 0.8;

class Spark {
  /**
   * 
   * @param { Vector } origin 
   * @param { string } color 
   */
  constructor(origin, color) {
    this.origin = origin;
    this.color = color;
    this.reset();
  }

  get active() {
    return this.age < this.timeSpan || this.history.length > 1;
  }
  
  reset() {
    this.velocity = Vector.fromAngle(random.range(0, Math.PI * 2));
    this.velocity.mult(random.range(10, 80));
    this.length = random.rangeFloor(2, 3);
    this.history = [this.origin];
    this.age = 0;
    this.timeSpan = random.range(4, 20);
    this.lineWidth = random.range(4, 10);
  }

  update() {
    if (!this.active) {
      return;
    }

    if (this.age < this.timeSpan) {
      const pos = this.history[0].copy();
      pos.add(this.velocity);
      this.history.unshift(pos);
      if (this.length < this.history.length) {
        this.history.pop();
      }
    } else {
      this.history.pop();
    }

    this.velocity.mult(drag);
    this.age++;
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  draw(context) {
    if (!this.active) {
      return;
    }
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 1; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    }
    context.lineWidth = this.lineWidth;
    context.lineCap = 'round'
    context.strokeStyle = this.color;
    context.stroke();
  }
}

class Sparkler {
  constructor (x, y, height) {
    this.origin = new Vector(x, y);
    this.height = height;
    this.sparks = [];
  }

  update() {
    let spark;
    for (let i = 0; i < 12; i++) {
      const inactiveSparks = this.sparks.filter(s => !s.active);
      if (inactiveSparks.length > 0) {
        spark = inactiveSparks[0];
        spark.reset();
      } else {
        spark = new Spark(this.origin, random.pick(colors));
        this.sparks.push(spark);
      }
    }

    this.sparks.forEach(spark => spark.update());
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  draw(context) {
    context.beginPath();
    context.moveTo(this.origin.x, this.origin.y);
    context.lineTo(this.origin.x, this.origin.y + this.height * 0.65);
    context.strokeStyle = '#70747c';
    context.lineWidth = 8;
    context.stroke();

    context.beginPath();
    context.moveTo(this.origin.x, this.origin.y + this.height * 0.65);
    context.lineTo(this.origin.x, this.origin.y + this.height);
    context.strokeStyle = '#9c9c9c';
    context.lineWidth = 2;
    context.stroke();
    this.sparks.forEach(s => s.draw(context));

    context.beginPath();
    context.arc(this.origin.x, this.origin.y, 5, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
  }
}

const sketch = ({ width, height }) => {
  const sparkler = new Sparkler(width * 0.5, height * 0.45, height * 0.65);
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    sparkler.update();
    sparkler.draw(context);
  };
};

canvasSketch(sketch, settings);
