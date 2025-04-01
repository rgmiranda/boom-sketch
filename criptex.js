const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'criptex'
};

const angles = 24;
const ratio = 1.2;
const angle = 2 * Math.PI / angles;
const alphabet = 'ABDCEFGHIJKLMNOPQRSTUVWXYZ0123456789';


class CriptexRow {
  /**
   * 
   * @param { number } innerRadius 
   * @param { number } outerRadius 
   */
  constructor(innerRadius, outerRadius) {
    this.codes = Array(angles).fill(false).map(() => random.pick(alphabet));
    this.position = 0;
    this.offset = 0;
    this.current = 0;
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.speed = random.range(0.01, 0.05);
    this.moving = false;
    this.fontSize = Math.max(outerRadius - innerRadius, 2 * Math.PI * innerRadius / angles);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    const prop = eases.cubicInOut(this.position);
    context.save();
    context.rotate(angle * (this.current + prop * this.offset));
    this.codes.forEach((c, i) => {
      context.beginPath();
      context.arc(0, 0, this.innerRadius, -angle * 0.5, angle * 0.5);
      context.arc(0, 0, this.outerRadius, angle * 0.5, - angle * 0.5, true);
      context.closePath();
      context.fillStyle = i % 2 === 0 ? 'black' : 'white';
      context.fill();
      
      context.font = `bold ${this.fontSize}px monospace`;
      context.textBaseline = 'middle';
      context.fillStyle = i % 2 === 0 ? 'white' : 'black';
      context.fillText(c, this.innerRadius, 0);

      context.rotate(angle);
    });
    context.restore();
  }

  update() {
    if (this.moving) {
      this.position += this.speed;
      if (this.position > 1) {
        this.moving = false;
      }
      return;
    }

    this.speed = 0.01;//random.range(0.01, 0.02);
    this.position = 0;
    this.moving = true;
    this.current += this.offset;
    this.offset = random.rangeFloor(-8, 8);
  }

}

class Criptex {
  /**
   * 
   * @param { number } width 
   * @param { number } height 
   */
  constructor (width, height) {
    this.width = width;
    this.height = height;
    /** @type { CriptexRow[] } */
    this.rows = [];

    let outerRadius = 100;
    let innerRadius = outerRadius / ratio;
    while (innerRadius < width * Math.SQRT1_2) {
      this.rows.push(new CriptexRow(innerRadius, outerRadius));
      innerRadius = outerRadius;
      outerRadius *= ratio;
    }
  }

  draw(context) {
    context.save();
    context.translate(this.width * 0.5, this.height * 0.5);
    this.rows.forEach(r => r.draw(context));
    context.restore();
  }
  
  update() {
    this.rows.forEach(r => r.update());
  }
}

const sketch = ({ width, height }) => {
  const criptex = new Criptex(width, height);
  return ({ context }) => {
    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height);
    criptex.update();
    criptex.draw(context);
  };
};

canvasSketch(sketch, settings);
