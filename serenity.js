const canvasSketch = require('canvas-sketch');
const { Vector } = require('./calc');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'the-fall'
};

const windFreq = 0.015;
const windAmp = Math.PI * 0.075;
const grassCount = 512;
const leafCount = 128;

class Grass {

  /**
   * 
   * @param { number } width 
   * @param { number } height 
   */
  constructor (width, height) {
    this.pos = new Vector(random.range(0, width), height);
    this.width = width;
    this.height = height;
    this.size = random.range(3, 6);
    this.length = random.range(20, 30);
    this.age = 0;
    this.angle = 0;
    this.thick = random.range(2, 5);
  }

  update() {
    this.angle = windAmp + random.noise3D(this.pos.x, this.pos.y, this.age, windFreq, windAmp);
    this.age++;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();

    context.translate(this.pos.x, this.pos.y);
    context.rotate(-Math.PI * 0.5);

    let length = this.length;
    let px = 0;
    let py = 0;
    context.beginPath();
    context.moveTo(px, py);
    for (let i = 1; i < this.size; i++) {
      px = px + Math.cos(this.angle * i) * length;
      py = py + Math.sin(this.angle * i) * length;
      context.lineTo(px, py);
      length *= 0.75;
    }
    context.strokeStyle = 'white';
    context.lineCap = 'round';
    context.lineWidth = this.thick;
    context.stroke();

    context.restore();
  }
}

class Leaf {

  /**
   * 
   * @param { number } width 
   * @param { number } height 
   */
  constructor (width, height) {
    this.width = width;
    this.height = height;
    this.reset();
  }
  
  reset() {
    if (random.chance(0.5)) {
      this.pos = new Vector(0, random.range(0, this.height));
    } else {
      this.pos = new Vector(random.range(0, this.width), 0);
    }
    this.active = true;
    this.size = random.range(2, 4);
    this.age = random.rangeFloor(0, 1000);
    this.vel = new Vector(0, 0);
    this.baseSpeed = random.range(3, 6);
    this.speed = this.baseSpeed;
  }

  update() {
    const angle = 1.5 * windAmp + random.noise3D(this.pos.x, this.pos.y, this.age, windFreq * 0.5, windAmp);
    this.speed = this.baseSpeed + random.noise1D(this.age, windFreq, 2);
    this.vel.x = Math.cos(angle) * this.speed;
    this.vel.y = Math.sin(angle) * this.speed;
    this.pos.add(this.vel);
    this.age++;

    if (this.pos.x > this.width || this.pos.y > this.height) {
      this.reset();
    }

  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();

    context.translate(this.pos.x, this.pos.y);
    context.beginPath();
    context.arc(0, 0, this.size, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();

    context.restore();
  }
}

const sketch = ({ width, height }) => {
  const grass = Array(grassCount).fill(0).map(() => new Grass(width, height));
  const leaves = Array(leafCount).fill(0).map(() => new Leaf(width, height));
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    leaves.forEach(l => {
      l.update();
      l.draw(context);
    })

    grass.forEach(g => {
      g.update();
      g.draw(context);
    });
  };
};

canvasSketch(sketch, settings);
