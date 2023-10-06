const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  fps: 24,
  name: 'variable-pattern'
};

const gridSize = 8;

class Tile {
  #x = 0;
  #y = 0;
  #size = 0;
  #fg = 'white';
  #bg = 'black';
  #timespan = 0;
  #age = 0;
  #rotation = 0;
  #drawFn = () => {};

  static #colorGroups = [
    ['#006e90', '#f18f01'],
    ['#9bafd9', '#103783'],
    ['#f75c03', '#d90368'],
    ['#ffd800', '#7902aa'],
    ['#f18f01', '#048ba8'],
    ['#ef6f6c', '#465775'],
    ['#db2763', '#b0db43'],
  ];

  static #tileDisplayers = [
    /**
     * 
     * @param { Tile } tile 
     * @param { CanvasRenderingContext2D } context 
     */
    (tile, context) =>
    {
      context.save();

      context.translate(tile.x + tile.size * 0.5, tile.y + tile.size * 0.5);
      context.rotate(0.5 * Math.PI * tile.rotation);
      context.fillStyle = tile.bg;
      context.fillRect(-tile.size * 0.5, -tile.size * 0.5, tile.size, tile.size);

      context.fillStyle = tile.fg;
      context.beginPath();
      context.moveTo(-tile.size * 0.5, -tile.size * 0.5);
      context.arc(-tile.size * 0.5, -tile.size * 0.5, tile.size, 0, Math.PI * 0.5);
      context.fill();


      context.restore();
    },
    /**
     * 
     * @param { Tile } tile 
     * @param { CanvasRenderingContext2D } context 
     */
    (tile, context) =>
    {
      context.save();

      context.translate(tile.x + tile.size * 0.5, tile.y + tile.size * 0.5);
      context.rotate(0.5 * Math.PI * tile.rotation);
      context.fillStyle = tile.bg;
      context.fillRect(-tile.size * 0.5, -tile.size * 0.5, tile.size, tile.size);

      context.fillStyle = tile.fg;
      context.beginPath();
      context.arc(tile.size * 0.5, tile.size * 0.5, tile.size, Math.PI, Math.PI * 1.5);
      context.arc(-tile.size * 0.5, -tile.size * 0.5, tile.size, 0, Math.PI * 0.5);
      context.fill();


      context.restore();
    },
    /**
     * 
     * @param { Tile } tile 
     * @param { CanvasRenderingContext2D } context 
     */
    (tile, context) =>
    {
      context.save();

      context.translate(tile.x + tile.size * 0.5, tile.y + tile.size * 0.5);
      context.rotate(0.5 * Math.PI * tile.rotation);
      context.fillStyle = tile.bg;
      context.fillRect(-tile.size * 0.5, -tile.size * 0.5, tile.size, tile.size);

      context.fillStyle = tile.fg;
      context.beginPath();
      context.moveTo(-tile.size * 0.5, -tile.size * 0.5);
      context.lineTo(tile.size * 0.5, -tile.size * 0.5);
      context.lineTo(-tile.size * 0.5, tile.size * 0.5);
      context.fill();

      context.restore();
    },
    /**
     * 
     * @param { Tile } tile 
     * @param { CanvasRenderingContext2D } context 
     */
    (tile, context) =>
    {
      context.save();

      context.translate(tile.x + tile.size * 0.5, tile.y + tile.size * 0.5);
      context.rotate(0.5 * Math.PI * tile.rotation);
      context.fillStyle = tile.bg;
      context.fillRect(-tile.size * 0.5, -tile.size * 0.5, tile.size, tile.size);

      context.fillStyle = tile.fg;
      context.beginPath();
      context.moveTo(-tile.size * 0.5, -tile.size * 0.5);
      context.lineTo(tile.size * 0.5, tile.size * 0.5);
      context.lineTo(-tile.size * 0.5, tile.size * 0.5);
      context.lineTo(tile.size * 0.5, -tile.size * 0.5);
      context.fill();

      context.restore();
    },
    /**
     * 
     * @param { Tile } tile 
     * @param { CanvasRenderingContext2D } context 
     */
    (tile, context) =>
    {
      context.save();

      context.translate(tile.x + tile.size * 0.5, tile.y + tile.size * 0.5);
      context.rotate(0.5 * Math.PI * tile.rotation);
      context.fillStyle = tile.bg;
      context.fillRect(-tile.size * 0.5, -tile.size * 0.5, tile.size, tile.size);
      
      context.fillStyle = tile.fg;
      context.fillRect(-tile.size * 0.5, -tile.size * 0.5, tile.size * 0.5, tile.size * 0.5);
      context.fillRect(0, 0, tile.size * 0.5, tile.size * 0.5);

      context.restore();
    },
  ];

  constructor (x, y, size) {
    this.#x = x;
    this.#y = y;
    this.#size = size;
    this.reset();
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

  get fg() {
    return this.#fg;
  }

  get bg() {
    return this.#bg;
  }

  get rotation() {
    return this.#rotation;
  }

  get isAlive() {
    return this.#age < this.#timespan;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    this.#drawFn(this, context);
    this.#age++;
    if (!this.isAlive) {
      this.reset();
    }
  }

  reset() {
    this.#timespan = random.range(48 * 2, 96 * 2);
    this.#age = 0;
    this.#drawFn = random.pick(Tile.#tileDisplayers);
    [this.#bg, this.#fg] = random.pick(Tile.#colorGroups);
    this.#rotation = random.rangeFloor(0, 4);
  }
}

const sketch = ({ width }) => {
  let x, y;
  const size = width / gridSize;

  const tiles = [];
  for (let i = 0; i < gridSize; i++) {
    y = i * size;
    for (let j = 0; j < gridSize; j++) {
      x = j * size;
      tiles.push(new Tile(x, y, size));
    }
  }

  return ({ context }) => {
    tiles.forEach(tile => tile.draw(context));
  };
};

canvasSketch(sketch, settings);
