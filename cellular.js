const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');
const createColormap = require('colormap');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'cellular',
  animate: true,
};
const wallPartsNum = 128;
const colors = createColormap({
  colormap: 'rainbow-soft',
  nshades: wallPartsNum
})

class CellWallPart {

  static speed = 10;
  static delaySpan = 50;

  /**
   * 
   * @param { {
   *  origin: number,
   *  destination: number,
   *  direction: number,
   *  position: number,
   *  totalDelay: number,
   *  waiting: boolean } } param0
   */
  constructor({ origin, destination, position = undefined, direction = 1, totalDelay = 0, waiting = false }) {
    this.dist = destination - origin;
    this.origin = origin;
    this.destination = destination;
    this.position = position ? math.clamp(position, this.origin, this.destination) : origin;
    this.direction = direction;
    this.waiting = waiting;
    this.totalDelay = totalDelay;
    this.x = this.origin + this.dist * eases.quadInOut((this.position - this.origin) / this.dist);
  }

  update() {
    if (this.waiting) {
      this.totalDelay++;
      if (this.totalDelay > CellWallPart.delaySpan) {
        this.waiting = false;
        this.totalDelay = 0;
      }
      return;
    }
    this.position += CellWallPart.speed * this.direction;
    if (this.position < this.origin || this.position > this.destination) {
      this.position = math.clamp(this.position, this.origin, this.destination);
      this.direction *= -1;
      this.waiting = true;
      this.totalDelay = 0;
    }
    this.x = this.origin + this.dist * eases.quadInOut((this.position - this.origin) / this.dist);
  }
};

const sketch = ({ width, height }) => {
  const origin = width * 0.15;
  const destination = width * 0.45;
  const mid = (origin + destination) * 0.5;
  
  const angle = 2 * Math.PI / wallPartsNum;
  /** @type { [ [ CellWallPart, CellWallPart  ] ] } */
  const cellWall = [
    [
      new CellWallPart({
        origin,
        destination,
        position: destination,
        waiting: true,
        direction: -1,
      }),
      new CellWallPart({
        origin,
        destination,
        position: mid,
        waiting: false,
        direction: 1,
      }),
    ],
    [
      new CellWallPart({
        origin,
        destination,
        position: mid,
        waiting: false,
        direction: -1,
      }),
      new CellWallPart({
        origin,
        destination,
        position: origin,
        waiting: true,
        direction: 1,
      }),
    ]
  ];
  return (
    /**
     * @param {{ context: CanvasRenderingContext2D, width: number, height: number }} 
     */
    ({ context }) => {
      context.save();
      context.fillStyle = 'black';
      context.lineWidth = 4;
      context.fillRect(0, 0, width, height);
      context.translate(width * 0.5, height * 0.5);
      cellWall.forEach(([p, q]) => {
        p.update();
        q.update();
      });
      for (let i = 0; i < wallPartsNum; i++) {
        context.strokeStyle = colors[i];
        context.fillStyle = colors[i];
        const [p, q] = cellWall[i % cellWall.length];
        context.beginPath();
        context.moveTo(p.x, 0);
        context.lineTo(q.x, 0);
        context.stroke();

        if (p.waiting) {
          const r = math.mapRange(Math.abs(p.x - q.x), 0, p.dist, 10, 2, true);
          context.beginPath();
          context.arc(p.x, 0, r, 0, Math.PI * 2);
          context.fill();
        }

        if (q.waiting) {
          const r = math.mapRange(Math.abs(p.x - q.x), 0, p.dist, 10, 2, true);
          context.beginPath();
          context.arc(q.x, 0, r, 0, Math.PI * 2);
          context.fill();
        }

        context.rotate(angle);
      }
      context.restore();
    }
  );
};

canvasSketch(sketch, settings);
