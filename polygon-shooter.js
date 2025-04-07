const { Vector } = require('@rgsoft/math');
const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'polygon-shooter',
  animate: true,
};

const colors = createColormap({
  nshades: 12,
  colormap: 'jet'
});

class Polygon {

  /**
   * 
   * @param { number } x 
   * @param { number } y 
   * @param { number } angle  
   */
  constructor(x, y, angle = undefined) {
    /** @type { number } */
    this.x = x;
    
    /** @type { number } */
    this.y = y;
    
    /** @type { number } */
    this.radius = random.range(10, 15);
    
    /** @type { Vector } */
    this.position = new Vector(x, y);

    /** @type { Vector } */
    this.velocity = Vector.fromAngle(angle ?? random.range(Math.PI, Math.PI * 2))
    .mult(random.range(10, 20));
    
    /** @type { numVectorber } */
    this.decay = random.range(0.95, 0.98);
    
    /** @type { number } */
    this.lineWidth = random.range(8, 10);
    
    /** @type { string } */
    this.color = random.pick(colors);
    
    /** @type { number } */
    this.angle = random.range(0, Math.PI * 2);
    
    /** @type { number } */
    this.angleSpeed = random.pick([1, -1]) * random.range(0.1, 0.25);
    
    /** @type { number } */
    this.sides = random.rangeFloor(3, 9);

    const innerAngle = 2 * Math.PI / this.sides;

    /** @type { Vector[] } */
    this.points = Array(this.sides).fill(0).map((_, i) => {
      return new Vector(Math.cos(i * innerAngle), Math.sin(i * innerAngle));
    });
  }

  /**
   * @returns { boolean }
   */
  get isActive() {
    return this.lineWidth >= 0.5;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    if (!this.isActive) {
      return;
    }

    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    context.strokeStyle = this.color;
    context.lineWidth = this.lineWidth;
    context.beginPath();
    this.points.forEach((p, i) => {
      if (i === 0) {
        context.moveTo(p.x * this.radius, p.y * this.radius);
      } else {
        context.lineTo(p.x * this.radius, p.y * this.radius);
      }
    });
    context.closePath();
    context.stroke();
    context.restore();
  }

  update() {
    if (!this.isActive) {
      return;
    }

    this.lineWidth *= this.decay;
    //this.radius *= this.decay;
    this.position.add(this.velocity);
    //this.velocity.mult(this.decay);
    this.angle += this.angleSpeed;
    //this.angleSpeed *= this.decay;

  }
}


const sketch = ({ width, height }) => {
  /** @type { Polygon[] } */
  let polygons = [];

  let a = 0;

  return ({ context,  }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    //const angle = Math.sin(a) * Math.PI * 0.25 - Math.PI * 0.5;
    const angle = random.noise1D(a, 0.25, Math.PI * 0.25) - Math.PI * 0.5;
    polygons.push(new Polygon(width * 0.5, height * 0.95, angle));
    polygons.forEach(p => {
      p.update();
      p.draw(context);
    });
    polygons = polygons.filter(p => p.isActive);
    a += 0.05;
  };
};

canvasSketch(sketch, settings);
