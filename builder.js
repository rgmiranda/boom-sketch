const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'builder'
};

const gravity = 30;
const brickSize = 60;

const colors = createColormap({
  colormap: 'hsv',
  nshades: 16,
});

class Brick {
  constructor(x, y, floor, color) {
    this.x = x;
    this.color = color;
    this.y = y;
    this.vy = 0;
    this.floor = floor;
    this.isFalling = false;
  }

  /**
   * 
   * @param {number} timeDelta 
   */
  update(timeDelta) {
    if (!this.isFalling) {
      return;
    }
    this.vy += timeDelta * gravity;
    this.y += this.vy;
    if (this.y + brickSize > this.floor) {
      this.isFalling = false;
      this.y = this.floor - brickSize;
      this.vy = 0;
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, brickSize, brickSize);
  }
};

const sketch = ({ width, height }) => {
  const rows = Math.ceil(height / brickSize);
  const cols = Math.ceil(width / brickSize);
  const brickCounter = Array(cols).fill(0);
  const delay = 1;
  let totalDelta = 0;

  const brickColumns = Array(cols).fill(false).map((_, i) => {
    return Array(rows).fill(false)
    .map((_, j) => {
        const x = i * brickSize;
        const y = -(j + 1) * brickSize;
        const floor = height - j * brickSize;
        const color = random.pick(colors);
        return new Brick(x, y, floor, color)
      });
  });

  return ({ context, deltaTime }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    totalDelta += deltaTime;

    if (totalDelta < delay) {
      return;
    }

    const available = brickCounter.map((c, i) => ({c, i})).filter(e => e.c < rows).map(e => e.i);
    if (available.length > 0) {
      const i = random.pick(available);
      brickColumns[i][brickCounter[i]].isFalling = true;
      brickCounter[i]++;
    }

    if (!brickColumns.some(brickColumn => brickColumn.some(brick => brick.isFalling))) {
      for (let i = 0; i < cols; i++) {
        brickCounter[i] = 0;
        brickColumns[i].forEach(brick => brick.floor += height);
      }
    }

    brickColumns.forEach(bricks => {
      bricks.forEach(b => {
        b.update(deltaTime);
        b.draw(context);
      });
    });
  };
};

canvasSketch(sketch, settings);
