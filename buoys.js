const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random'); 
const math = require('canvas-sketch-util/math'); 
const { Vector } = require('./calc');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};
const buoyCount = 2048;
const scale = 0.02;
const amp = 15;

class Buoy {

  /**
   * 
   * @param { number } x 
   * @param { number } y 
   */
  constructor (x, y) {
    this.pos = new Vector(x, y);
    this.dist = this.pos.mag;
    this.dir = this.pos.copy();
    this.dir.normalize();
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context
   * @param { number } frame 
   * @param { number } maxDist
   */
  draw(context, frame, maxDist) {
    const disp = math.mapRange(this.dist, 0, maxDist, 0, 8 * Math.PI);
    const offset = Math.cos(disp - frame * 0.2) * amp;
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(this.pos.x + this.dir.x * offset, this.pos.y + this.dir.y * offset, 3, 0, Math.PI * 2);
    context.fill();
  }
}

const sketch = ({ width, height, context }) => {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const maxDist = Math.sqrt(width * width + height * height) * 0.5;
  const buoys = Array(buoyCount).fill(0).map(() => new Buoy(random.rangeFloor(0, width) - width * 0.5, random.rangeFloor(0, height) - height * 0.5) );
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(cx, cy);
    buoys.forEach(b => b.draw(context, frame, maxDist));
  };
};

canvasSketch(sketch, settings);
