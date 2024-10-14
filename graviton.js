const { Vector } = require('@rgsoft/math');
const canvasSketch = require('canvas-sketch');
const { math, random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `graviton-${Date.now()}`,
};

const G = 2;
const numBalls = 8;
const cellSize = 10;

class Ball {

  /**
   * 
   * @param { number } x 
   * @param { number } y 
   * @param { number } size
   */
  constructor(x, y, size) {
    this.pos = new Vector(x, y);
    this.acc = new Vector(0, 0);
    this.vel = new Vector(0, 0);
    this.size = size;
    this.mass = Math.sqrt(this.size);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * 
   * @param { Vector } force 
   */
  apply(force) {
    const nf = force.copy();
    nf.mult(1/this.mass);
    this.acc.add(nf);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  /**
   * 
   * @param { Ball } ball 
   */
  pull(ball) {
    const force = ball.pos.copy().sub(this.pos);
    const dist = force.mag;
    force.normalize();
    force.mult(math.clamp(G * this.size * ball.size / (dist * dist), 0, 0.5));
    this.apply(force);
    
    force.mult(-1);
    ball.apply(force);
  }
}

class Grid {
  /**
   * 
   * @param { number } width 
   * @param { number } height 
   * @param { number } cellSize 
   */
  constructor(width, height, cellSize) {
    /**
     * @type { number }
     */
    this.width = width;

    /**
     * @type { number }
     */
    this.height = height;

    /**
     * @type { number }
     */
    this.cellSize = cellSize;

    /**
     * @type { number }
     */
    this.cols = Math.ceil(width / cellSize) + 1;

    /**
     * @type { number }
     */
    this.rows = Math.ceil(height / cellSize) + 1;

    /**
     * @type { number[] }
     */
    this.weights = Array(this.cols * this.rows).fill(0);
  }

  resetValues() {
    this.weights.fill(0);
  }

  /**
   * 
   * @param { Ball[] } balls 
   */
  apply(balls) {
    for (let i = 0; i < this.rows; i++) {
      const y = i * this.cellSize;
      for (let j = 0; j < this.cols; j++) {
        const x = j * this.cellSize;
        let weight = 0;
        balls.forEach(ball => {
          weight += (0.25 * ball.size * ball.size) / ((x - ball.pos.x) * (x - ball.pos.x) + (y - ball.pos.y) * (y - ball.pos.y));
        });
        this.weights[i * this.cols + j] = weight;
      }
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    this.weights.forEach((v, i, arr) => {
      const ix = i % this.cols;
      const iy = Math.floor(i / this.cols);
      const px = ix * this.cellSize;
      const py = iy * this.cellSize;
      if (ix >= this.cols - 1 || iy >= this.rows - 1) {
        return;
      }
      const pixelsPoints = [
        arr[iy * this.cols + ix],
        arr[iy * this.cols + ix + 1],
        arr[(iy + 1) * this.cols + ix + 1],
        arr[(iy + 1) * this.cols + ix],
      ];
      const conf = pixelsPoints.reduce((acc, curr, j) =>
        acc + ((curr >= 1) ? (2 ** (pixelsPoints.length - 1 - j)) : 0), 0
      );
      const midPoints = pixelsPoints.map((v, j) => {
        const k = (j + 1) % pixelsPoints.length;
        let r;
        if (j >= pixelsPoints.length * 0.5) {
          r = (1 - pixelsPoints[k]) / (v - pixelsPoints[k]);
        } else {
          r = (1 - v) / (pixelsPoints[k] - v);
        }
        return this.cellSize * r;
      });

      switch (conf) {
        case 0:
          break;
        case 1:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[2], py + this.cellSize);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.lineTo(px, py + this.cellSize);
          ctx.closePath();
          ctx.fill();
        break;
        case 2:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[2], py + this.cellSize);
          ctx.lineTo(px + this.cellSize, py + midPoints[1]);
          ctx.lineTo(px + this.cellSize, py + this.cellSize);
          ctx.closePath();
          ctx.fill();
          break;
        case 3:
          ctx.beginPath();
          ctx.moveTo(px + this.cellSize, py + midPoints[1]);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.lineTo(px, py + this.cellSize);
          ctx.lineTo(px + this.cellSize, py + this.cellSize);
          ctx.closePath();
          ctx.fill();
          break;
        case 4:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px + this.cellSize, py + midPoints[1]);
          ctx.lineTo(px + this.cellSize, py);
          ctx.closePath();
          ctx.fill();
          break;
        case 5:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px + this.cellSize, py + midPoints[1]);
          ctx.lineTo(px + this.cellSize, py);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(px + midPoints[2], py + this.cellSize);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.lineTo(px, py + this.cellSize);
          ctx.closePath();
          ctx.fill();
          break;
        case 6:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px + midPoints[2], py + this.cellSize);
          ctx.lineTo(px + this.cellSize, py + this.cellSize);
          ctx.lineTo(px + this.cellSize, py);
          ctx.closePath();
          ctx.fill();
          break;
        case 7:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.lineTo(px, py + this.cellSize);
          ctx.lineTo(px + this.cellSize, py + this.cellSize);
          ctx.lineTo(px + this.cellSize, py);
          ctx.closePath();
          ctx.fill();
          break;
        case 8:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.lineTo(px, py);
          ctx.closePath();
          ctx.fill();
          break;
        case 9:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px + midPoints[2], py + this.cellSize);
          ctx.lineTo(px, py + this.cellSize);
          ctx.lineTo(px, py);
          ctx.closePath();
          ctx.fill();
          break;
        case 10:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.lineTo(px, py);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(px + midPoints[2], py + this.cellSize);
          ctx.lineTo(px + this.cellSize, py + midPoints[1]);
          ctx.lineTo(px + this.cellSize, py + this.cellSize);
          ctx.closePath();
          ctx.fill();
          break;
        case 11:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px + this.cellSize, py + midPoints[1]);
          ctx.lineTo(px + this.cellSize, py + this.cellSize);
          ctx.lineTo(px, py + this.cellSize);
          ctx.lineTo(px, py);
          ctx.closePath();
          ctx.fill();
          break;
        case 12:
          ctx.beginPath();
          ctx.moveTo(px + this.cellSize, py + midPoints[1]);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.lineTo(px, py);
          ctx.lineTo(px + this.cellSize, py);
          ctx.closePath();
          ctx.fill();
          break;
        case 13:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[2], py + this.cellSize);
          ctx.lineTo(px + this.cellSize, py + midPoints[1]);
          ctx.lineTo(px + this.cellSize, py);
          ctx.lineTo(px, py);
          ctx.lineTo(px, py + this.cellSize);
          ctx.closePath();
          ctx.fill();
          break;
        case 14:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[2], py + this.cellSize);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.lineTo(px, py);
          ctx.lineTo(px + this.cellSize, py);
          ctx.lineTo(px + this.cellSize, py + this.cellSize);
          ctx.closePath();
          ctx.fill();
          break;
        case 15:
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + this.cellSize, py);
          ctx.lineTo(px + this.cellSize, py + this.cellSize);
          ctx.lineTo(px, py + this.cellSize);
          ctx.closePath();
          ctx.fill();
          break;

        default:
          break;
      }
    });
  }
}

const sketch = ({ width, height }) => {
  /** @type { Ball[] } */
  const balls = Array(numBalls).fill(false).map(() => new Ball(random.range(0, width), random.range(0, height), random.range(100, 400)));

  /** @type { Grid } */
  const grid = new Grid(width, height, cellSize);

  return ({ context }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    balls.forEach((ball, i) => {
      for (let j = i + 1; j < balls.length; j++) {
        const otherBall = balls[j];
        ball.pull(otherBall);
      }
      ball.update();
    });
    context.fillStyle = 'white';
    grid.apply(balls);
    grid.draw(context);
  };
};

canvasSketch(sketch, settings);
