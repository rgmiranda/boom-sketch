const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');
const risoColors = require('riso-colors');
const { Vector } = require('./calc');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'trip'
};

const speed = 5;
const numStars = 256;

class Rocket {
  /**
   * 
   * @param { number } width 
   * @param { number } height 
   * @param { string } color 
   */
  constructor (width, height, color) {
    this.body = [
      new Vector(random.range(width * 0.2, width * 0.8), random.range(height * 0.05, height * 0.4))
    ];
    this.width = width;
    this.height = height;
    this.color = color;
    this.noiseFreq = 0.07;
    this.noiseAmp = 3;
  }

  /**
   * 
   * @param { number } frame 
   */
  update(frame) {
    const head = this.body[0];
    const newPos = head.copy();
    newPos.add(new Vector(Math.sin((head.y + frame) * this.noiseFreq) * this.noiseAmp, 0));
    this.body.forEach(v => {
      v.y += speed;
    });
    this.body = this.body.filter(v => v.y < this.height);
    this.body.unshift(newPos);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    for (let i = 1; i < this.body.length; i++) {
      ctx.beginPath();
      ctx.globalAlpha = math.mapRange(i, 1, this.body.length - 1, 1, 0, true);
      ctx.moveTo(this.body[i - 1].x, this.body[i - 1].y);
      ctx.lineTo(this.body[i].x, this.body[i].y);
      ctx.stroke();
    }
    ctx.restore();
  }
}

const sketch = ({ width, height }) => {
  const rockets = [
    new Rocket(width, height, '#e00065'),
    new Rocket(width, height, '#fa5a0f'),
    new Rocket(width, height, '#ffda0a'),
    new Rocket(width, height, '#00a0d1'), 
    new Rocket(width, height, '#6a17de'), 
  ];

  const stars = Array(numStars).fill(0).map(() => ({
    x: random.range(0, width),
    y: random.range(0, height)
  }));
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    stars.forEach(s => {
      s.y += speed;
      if (s.y > height) {
        s.y = 0;
        s.x = random.range(0, width);
      }
      context.beginPath();
      context.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      context.fillStyle = 'white';
      context.fill();
    });
    rockets.forEach(r => {
      r.update(frame);
      r.draw(context);
    });
  };
};

canvasSketch(sketch, settings);
