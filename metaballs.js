const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};
const pixelSize = 20;

class Ball {

  /**
   * @type { number }
   */
  #x;

  /**
   * @type { number }
   */
  #y;

  /**
   * @type { number }
   */
  #vx;

  /**
   * @type { number }
   */
  #vy;

  /**
   * @type { number }
   */
  #size

  /**
   * 
   * @param { number } x 
   * @param { number } y 
   */
  constructor (x, y) {
    this.#x = x;
    this.#y = y;
    this.#vx = Math.random() * 6 - 3;
    this.#vy = Math.random() * 6 - 3;
    this.#size = Math.random() * 100 + 100;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.#x, this.#y, this.#size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }

  update(width, height) {
    if (this.#x < 0 || this.#x > width) {
      this.#vx *= -1;
    }
    if (this.#y < 0 || this.#y > height) {
      this.#vy *= -1;
    }
    this.#x += this.#vx;
    this.#y += this.#vy;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get size() {
    return this.#size;
  }
}

class Grid {

  

  /**
   * @type { number }
   */
  #cols;
  
  /**
   * @type { number }
   */
  #rows;
  
  /**
   * @type { number }
   */
  #pixelSize;
  
  /**
   * @type { number[] }
   */
  #weights;

  /**
   * 
   * @param { number } width 
   * @param { number } height 
   * @param { number } pixelSize 
   */
  constructor (width, height, pixelSize) {
    this.#pixelSize = pixelSize;
    this.#cols = Math.ceil(width / pixelSize);
    this.#rows = Math.ceil(height / pixelSize);
    this.#weights = Array(this.#rows * this.#cols).fill(0);
  }

  /**
   * 
   * @param { Ball[] } balls 
   */
  update(balls) {
    this.#weights.forEach((v, i, a) => {
      let val = 0;
      const ix = i % this.#cols;
      const iy = Math.floor(i / this.#cols);
      const px = ix * this.#pixelSize;
      const py = iy * this.#pixelSize;
      balls.forEach(b => {
        val += (b.size * b.size) / ((b.x - px) * (b.x - px) + (b.y - py) * (b.y - py));
      });
      a[i] = val;
    });
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    this.#weights.forEach((v, i, arr) => {
      const ix = i % this.#cols;
      const iy = Math.floor(i / this.#cols);
      const px = ix * this.#pixelSize;
      const py = iy * this.#pixelSize;
      if ( ix >= this.#cols - 1 || iy >= this.#rows -1 ) {
        return;
      }
      const pixelsPoints = [
        arr[iy * this.#cols + ix],
        arr[iy * this.#cols + ix + 1],
        arr[(iy + 1) * this.#cols + ix + 1],
        arr[(iy + 1) * this.#cols + ix],
      ];
      const conf = pixelsPoints.reduce((acc, curr, j) =>
        acc + ((curr >= 1) ? (2 ** (pixelsPoints.length - 1 - j)) : 0), 0
      );
      const midPoints = pixelsPoints.map((v, j) => {
        const k = (j + 1) % pixelsPoints.length;
        let r;
        if ( j >= pixelsPoints.length * 0.5) {
          r = (1 - pixelsPoints[k]) / (v - pixelsPoints[k]);
        } else {
          r = (1 - v) / (pixelsPoints[k] - v);
        }
        return this.#pixelSize * r;
      });

      switch (conf) {
        case 0:
          break;
        case 1:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[2], py + this.#pixelSize);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.stroke();
          break;
        case 2:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[2], py + this.#pixelSize);
          ctx.lineTo(px + this.#pixelSize, py + midPoints[1]);
          ctx.stroke();
          break;
        case 3:
          ctx.beginPath();
          ctx.moveTo(px + this.#pixelSize, py + midPoints[1]);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.stroke();
          break;
        case 4:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px + this.#pixelSize, py + midPoints[1]);
          ctx.stroke();
          break;
        case 5:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px + this.#pixelSize, py + midPoints[1]);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(px + midPoints[2], py + this.#pixelSize);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.stroke();
          break;
        case 6:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px + midPoints[2], py + this.#pixelSize);
          ctx.stroke();
          break;
        case 7:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.stroke();
          break;
        case 8:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.stroke();
          break;
        case 9:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px + midPoints[2], py + this.#pixelSize);
          ctx.stroke();
          break;
        case 10:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(px + midPoints[2], py + this.#pixelSize);
          ctx.lineTo(px + this.#pixelSize, py + midPoints[1]);
          ctx.stroke();
          break;
        case 11:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[0], py);
          ctx.lineTo(px + this.#pixelSize, py + midPoints[1]);
          ctx.stroke();
          break;
        case 12:
          ctx.beginPath();
          ctx.moveTo(px + this.#pixelSize, py + midPoints[1]);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.stroke();
          break;
        case 13:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[2], py + this.#pixelSize);
          ctx.lineTo(px + this.#pixelSize, py + midPoints[1]);
          ctx.stroke();
          break;
        case 14:
          ctx.beginPath();
          ctx.moveTo(px + midPoints[2], py + this.#pixelSize);
          ctx.lineTo(px, py + midPoints[3]);
          ctx.stroke();
          break;
        case 15:
          break;
      
        default:
          break;
      }
    });
  }
}

const sketch = ({ width, height }) => {
  const balls = Array(3).fill(0).map(() => new Ball(Math.random() * width, Math.random() * height));
  const grid = new Grid(width, height, pixelSize);
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    balls.forEach(b => b.update(width, height));
    grid.update(balls);
    grid.draw(context);
  };
};

canvasSketch(sketch, settings);
