const { Vector } = require('@rgsoft/math');
const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const { Pane } = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `pick-${Date.now()}`,
  //fps: 12
};

const params = {
  diagonalMove: true,
  squareMove: true,
  plotPoint: false,
  lineWidth: 0.5,
};

let sketchManager;

/** @type { Pointer[] } */
let pointers = [];

/** @type { number } */
let cols;

/** @type { number } */
let rows;

const pane = new Pane();
pane.addInput(params, 'diagonalMove');
pane.addInput(params, 'squareMove');
pane.addInput(params, 'plotPoint');
pane.addInput(params, 'lineWidth', {
  min: 0,
  max: 1,
});
pane.on('change', () => { 
  generatePointers(cols, rows);
  if (sketchManager) {
    sketchManager.render();
  }
});

const pixelSize = 18;
const bg = '#f6eee3';
const fg = '#3D5588';

class Pointer {

  /**
   * 
   * @param { number } x 
   * @param { number } y 
   * @param { boolean[][] } points 
   * @param { Vector[] } directions 
   */
  constructor(x, y, points, directions) {
    if (!Array.isArray(points) || points.length === 0) {
      throw new Error('Empty points array');
    }
    if (y < 0 || y >= points.length) {
      throw new Error('Invalid y');
    }
    if (x < 0 || x >= points[0].length) {
      throw new Error('Invalid x');
    }
    this.x = x;
    this.y = y;
    this.points = points;
    this.history = [];
    this.points[y][x] = true;
    this.directions = directions;
  }

  /**
   * 
   * @param { boolean[][] } points 
   * @param { Vector[] } points 
   */
  static create(points, directions) {
    const available = [];
    points.forEach((row, y) => {
      row.forEach((value, x) => {
        if (!value) {
          available.push({ x, y });
        }
      });
    });

    if (available.length === 0) {
      return null;
    }

    const { x, y } = random.pick(available);
    return new Pointer(x, y, points, directions);
  }

  /**
   * 
   * @returns { boolean }
   */
  move() {
    let available = [];
    let result = false;
    
    this.directions.forEach(dir => {
      const x = this.x + dir.x;
      const y = this.y + dir.y;
      if (y < 0 || y >= this.points.length) {
        return;
      }
      if (x < 0 || x >= this.points[0].length) {
        return;
      }
      if (this.points[y][x]) {
        return;
      }
      result = true;
      available.push({ x, y });
    });

    if (available.length === 0) {
      this.directions.forEach(dir => {
        const x = this.x + dir.x;
        const y = this.y + dir.y;
        if (y < 0 || y >= this.points.length) {
          return;
        }
        if (x < 0 || x >= this.points[0].length) {
          return;
        }
        available.push({ x, y });
      });
    }
    const { x, y } = random.pick(available);
    this.points[y][x] = true;
    this.history.unshift({
      x: this.x,
      y: this.y,
    });
    this.x = x;
    this.y = y;
    return result;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    if (this.history.length === 0 && !params.plotPoint) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo((this.x + 0.5) * pixelSize, (this.y + 0.5) * pixelSize);
    if (this.history.length === 0) {
      ctx.lineTo((this.x + 0.5) * pixelSize, (this.y + 0.5) * pixelSize);
    } else {
      this.history.forEach(({x, y}) => {
        ctx.lineTo((x + 0.5) * pixelSize, (y + 0.5) * pixelSize);
      });
    }
    ctx.strokeStyle = fg;
    ctx.lineWidth = pixelSize * params.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}

/**
 * 
 * @param { number } cols
 * @param { number } rows
 * @returns { Pointer[] }
 */
const generatePointers = (cols, rows) => {
  /** @type { boolean[][] } */
  const points = Array(rows).fill(false).map(() => Array(cols).fill(false));

  const directions = [];
  if (params.squareMove) {
    directions.push(new Vector(-1, 0));
    directions.push(new Vector(1, 0));
    directions.push(new Vector(0, -1));
    directions.push(new Vector(0, 1));
  }
  if (params.diagonalMove) {
    directions.push(new Vector(-1, -1));
    directions.push(new Vector(1, -1));
    directions.push(new Vector(-1, 1));
    directions.push(new Vector(1, 1));
  }

  pointers = [];

  /** @type { Pointer } */
  let currentPointer = Pointer.create(points, directions);

  do {
    if (!currentPointer.move()) {
      pointers.push(currentPointer);
      currentPointer = Pointer.create(points, directions);
    }
  } while (currentPointer);

};

const sketch = ({ width, height }) => {
  cols = Math.ceil(width / pixelSize);
  rows = Math.ceil(height / pixelSize);
  generatePointers(cols, rows);

  return ({ context }) => {
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);
    pointers.forEach(pointer => {
      pointer.draw(context);
    });
  };
};

canvasSketch(sketch, settings).then(manager => sketchManager = manager);
