const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const { Vector } = require('./calc');
const seed = random.getRandomSeed();
random.setSeed(seed);

const numFlames = 16;
const settings = {
  dimensions: [ 1080, 1080 ],
  name: `fire-${seed}`
};
const ratio = 0.85;

const colors = createColormap({
  colormap: 'hot',
  nshades: numFlames,
});


class QuadraticCurve {

  /**
   * @param { string } color
   * @param { Vector[] } points
   */
  constructor(color, ...points) {
    if (!Array.isArray(points)) {
      throw new TypeError('Array excepted');
    }
    if (points.length === 0) {
      throw new TypeError('Empty array received');
    }
    this.points = points;
    this.color = color;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();

    context.beginPath();
    for (let i = 0; i < this.points.length - 1; i++) {
      const curr = this.points[i];
      const next = this.points[i + 1];

      const mx = (curr.x + next.x) * 0.5;
      const my = (curr.y + next.y) * 0.5;

      if (i === 0) {
        context.moveTo(curr.x, curr.y);
      } else if (i === this.points.length - 2) {
        context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
      } else {
        context.quadraticCurveTo(curr.x, curr.y, mx, my);
      }

    }
    context.closePath();
    context.fillStyle = this.color;
    context.fill();

    context.restore();
  }

}

const flames = Array(numFlames).fill(0).map((e, i) => {
  const appliedRatio = (ratio ** i);
  const x = random.noise1D(i, 0.1, 75) * appliedRatio;
  const y = - 540 * appliedRatio;
  return new QuadraticCurve(
    colors[i],
    new Vector(x, y),
    new Vector(680 * appliedRatio, 480),
    new Vector(-680 * appliedRatio, 480),
    new Vector(x, y),
  )
});

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5)
    flames.forEach(f => f.draw(context))
  };
};

canvasSketch(sketch, settings);
