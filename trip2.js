const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');
const { Vector } = require('./calc');
const { loadImage, getImageBrightness } = require('./images')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'trip-2',
  fps: 30,
};

const speed = 5;
const numStars = 128;
/** @type { HTMLImageElement } */
let image;

class Rocket {
  /**
   * 
   * @param { number } width 
   * @param { number } height
   * @param { string } color
   * @param { number } offset
   */
  constructor (width, height, color, offset) {
    this.body = [
      { 
        pos: new Vector(width * 0.5, height * 0.2),
        dir: new Vector(Math.sin((height * 0.1) * this.noiseFreq + this.offset) * this.noiseAmp, speed)
      }
    ];
    this.width = width;
    this.height = height;
    this.color = color;
    this.noiseFreq = 0.07;
    this.noiseAmp = 3;
    this.offset = offset;
  }

  /**
   * 
   * @param { number } frame 
   */
  update(frame) {
    const angle = Math.PI * 0.5 + Math.sin((this.height * 0.1 + frame) * this.noiseFreq + this.offset) * Math.PI * 0.1;
    const newPos = {
      pos: new Vector(this.width * 0.5, 200),
      dir: new Vector(Math.cos(angle) * speed, Math.sin(angle) * speed)
    }
    this.body.forEach(v => v.pos.add(v.dir));
    this.body = this.body.filter(v => v.pos.y < this.height);
    this.body.unshift(newPos);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.lineCap = 'round';
    for (let i = 0; i < this.body.length; i++) {
      const size = math.mapRange(i, 0, this.body.length - 1, 5, 1);
      ctx.beginPath();
      ctx.globalAlpha = math.mapRange(i, 1, this.body.length - 1, 1, 0, true);
      ctx.arc(this.body[i].pos.x, this.body[i].pos.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

const sketch = async ({ width, height }) => {
  image = await loadImage('images/rocket.png');
  const rocketOffset = Math.PI * 2 / 5;
  const rockets = [
    new Rocket(width, height, '#e00065', rocketOffset * 0),
    new Rocket(width, height, '#fa5a0f', rocketOffset * 1),
    new Rocket(width, height, '#ffda0a', rocketOffset * 2),
    new Rocket(width, height, '#00a0d1', rocketOffset * 3), 
    new Rocket(width, height, '#6a17de', rocketOffset * 4), 
  ];

  const stars = Array(numStars).fill(0).map(() => ({
    x: random.range(0, width),
    y: random.range(0, height),
    speed: random.range(1, 8),
    size: random.range(2, 4)
  }));
  let frame = 0;
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    stars.forEach(s => {
      s.y += s.speed;
      if (s.y > height) {
        s.y = 0;
        s.x = random.range(0, width);
        s.speed = random.range(1, 8);
        s.size = random.range(2, 4);
      }
      context.beginPath();
      context.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      context.fillStyle = 'white';
      context.fill();
    });
    rockets.forEach(r => {
      r.update(frame);
      r.draw(context);
    });
    context.drawImage(image, (width - image.width) * 0.5, 110);
    frame++;
  };
};

canvasSketch(sketch, settings);
