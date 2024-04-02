const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { Vector } = require('./calc/vector');
const { getLineFunction, getNormalPoint } = require('./calc/segments');
const createColormap = require('colormap');

const seed = random.getRandomSeed();
random.setSeed(seed);
const cellSize = 5;
const bg = 'black';
const fg = 'white';
const alpha = 0.25;
const settings = {
  dimensions: [ 1080, 1080 ],
  name: `fabric-${seed}`
};
const colors = createColormap({
  nshades: 12,
  colormap: 'copper'
});

class Segment {
  /**
   * 
   * @param { Vector } p 
   * @param { Vector } q 
   * @param { number } width
   */
  constructor(p, q, width) {
    
    /**
     * @type { Vector }
     */
    this.p = p;
    
    /**
     * @type { Vector }
     */
    this.q = q;

    /**
     * @type { number }
     */
    this.width = width;

    /**
     * @type { { m: number, b: number } }
     */
    this.lineParams = getLineFunction(p, q);
  }
}

class Layer {

  /**
   * 
   * @param { number } width 
   * @param { number } height 
   * @param { number } size 
   */
  constructor(width, height, size) {
    /**
     * @type { Segment[] }
     */
    this.segments = [
      
      new Segment(new Vector(0, 0), new Vector(0, height), random.range(15, 40)),
      new Segment(new Vector(0, 0), new Vector(width, 0), random.range(15, 40)),
      new Segment(new Vector(0, height), new Vector(width, height), random.range(15, 40)),
      new Segment(new Vector(width, 0), new Vector(width, height), random.range(15, 40)),

    ];
  
    const generators = [
      () => new Vector(0, Math.random() * height),
      () => new Vector(width, Math.random() * height),
      () => new Vector(Math.random() * width, 0),
      () => new Vector(Math.random() * width, height),
    ];
  
    for (let i = 0; i < size; i++) {
      let gp = random.pick(generators);
      let gq;
      do {
        gq = random.pick(generators);
      } while (gq === gp);
      const w = random.range(20, 50);
  
      this.segments.push(new Segment(gp(), gq(), w));
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    this.segments.forEach(segment => {
      ctx.beginPath();
      ctx.moveTo(segment.p.x, segment.p.y);
      ctx.lineTo(segment.q.x, segment.q.y);
      ctx.stroke();
    });
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
   * @param { Layer } layer 
   */
  applyLayer(layer) {
    for (let i = 0; i < this.rows; i++) {
      const y = i * this.cellSize;
      for (let j = 0; j < this.cols; j++) {
        const x = j * this.cellSize;
        const p = new Vector(x, y);
        let weight = 0;
        layer.segments.forEach(s => {
          const np = getNormalPoint(s.lineParams.m, s.lineParams.b, p);
          weight += (s.width * s.width) / ((p.x - np.x) * (p.x - np.x) + (p.y - np.y) * (p.y - np.y));
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
  /**
   * @type { Layer[] }
   */
  const layers = Array(colors.length).fill(0).map((v, i) => new Layer(width, height, Math.ceil(colors.length * 0.25)));
  const grid = new Grid(width, height, cellSize);
  return ({ context, width, height }) => {
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);
    layers.forEach((layer, i) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      /** @type { CanvasRenderingContext2D } */
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = colors[i];
      grid.resetValues();
      grid.applyLayer(layer);
      grid.draw(ctx);

      context.globalAlpha = 1;
      context.shadowColor = 'black';
      context.shadowBlur = 15;
      context.drawImage(canvas, 0, 0);
    });
  };
};

canvasSketch(sketch, settings);
