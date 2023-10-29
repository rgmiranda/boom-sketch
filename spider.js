const canvasSketch = require('canvas-sketch');
const { Vector } = require('./calc');
const math = require('canvas-sketch-util/math');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name:"spider-flies"
};

const rows = 8;
const cols = 8;
const spiderSpeed = 1;

const flySpeed = 5;
const flyFreq = 0.005;
const drag = 0.9;

const catchDist = 5;
const numFlies = 4;

class Fly {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.reset();
  }

  reset() {
    this.age = 0;
    this.absolutePos = new Vector(random.range(0, this.width), random.range(0, this.height));
    this.pos = this.absolutePos.copy();
    this.alive = true;
    this.angle = null;
  }

  update() {
    const angle = random.noise3D(this.absolutePos.x, this.absolutePos.y, this.age, flyFreq, Math.PI);
    const dir = Vector.fromAngle(angle);
    dir.mult(flySpeed);
    this.absolutePos.add(dir);
    this.pos.add(dir);
    this.angle = angle;
    this.age++;
    if (this.pos.x > this.width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = this.width;
    }
    if (this.pos.y > this.height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = this.height;
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.rotate(this.angle + Math.PI * 0.5);
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(0, 0, 8, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.arc(4, 6, 6, 0, Math.PI * 2);
    context.fill();
    
    context.beginPath();
    context.arc(-4, 6, 6, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}

class Spider {
  /**
   * 
   * @param { Vector[] } points 
   */
  constructor(points) {
    this.points = points;
    this.legs = null;
    this.pos = new Vector(0, 0);
    this.age = 0;
    this.offsetY = 0;
    this.acceleration = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.mult(drag);
    this.pos.add(this.velocity);
    this.age++;
    this.offsetY = Math.sin(this.age * 0.1) * 5;
    this.legs = this.points.map(point => ({ point, dist:  point.dist(this.pos)})).sort((a, b) => a.dist - b.dist);
    this.acceleration.mult(0, 0);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();
    context.fillStyle  = 'black';
    context.beginPath();
    context.arc(this.pos.x, this.pos.y + this.offsetY, 10, 0, Math.PI * 2);
    context.fill();

    for (let i = 0; i < 8; i++) {
      const diff = this.legs[i].point.copy();
      diff.sub(this.pos);
      const angle = diff.angle;
      const legWidth = math.mapRange(this.legs[i].dist, 0, 200, 8, 1, true);
      const lx = Math.cos(angle) * legWidth;
      const ly = Math.sin(angle) * legWidth;
      context.beginPath();
      context.moveTo(this.legs[i].point.x, this.legs[i].point.y);
  
      context.lineTo(this.pos.x + lx, this.pos.y + ly + this.offsetY);
      context.lineTo(this.pos.x - lx, this.pos.y - ly + this.offsetY);
      context.closePath();
      context.fill();
    }
    context.restore();
  }

  attract(x, y){
    const force = new Vector(x, y);
    force.sub(this.pos);
    force.normalize();
    force.mult(spiderSpeed);
    this.acceleration.add(force);
  }
}

/**
 * 
 * @param { Spider } spider 
 * @param { HTMLCanvasElement } canvas
 */
function addListeners(spider, canvas) {
  window.addEventListener('mousemove', ev => {
    const x = (ev.offsetX / canvas.offsetWidth) * canvas.width;
    const y = (ev.offsetY / canvas.offsetHeight) * canvas.height;
    spider.attract(x, y);
  });
}

const sketch = ({ width, height, canvas }) => {
  const pw = width / cols;
  const ph = height / rows;
  const points = [];
  for (let i = 0; i <= cols; i++) {
    const y = i * ph;
    for (let j = 0; j <= rows; j++) {
      const x = j * pw;
      points.push(new Vector(x, y));
    }
  }
  const spider = new Spider(points);
  const flies = Array(numFlies).fill(0).map(() => new Fly(width, height));
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    let fly;
    let minDist = Number.MAX_VALUE;
    flies.forEach(f => {
      f.update();
      f.draw(context);
      let d = f.pos.dist(spider.pos);
      if (d < minDist) {
        minDist = d;
        fly = f;
      }
    });
    spider.attract(fly.pos.x, fly.pos.y);
    spider.update();
    spider.draw(context);

    if (spider.pos.dist(fly.pos) <= catchDist) {
      fly.reset();
    }
  };
};

canvasSketch(sketch, settings);
