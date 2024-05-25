const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'fire',
  animate: true,
};

const acc = -0.5;
const drag = 0.98;
const numSources = 3;
let emit = false;

const mousePos = {
  x: 0,
  y: 0,
};

const colors = createColormap({
  colormap: 'hot',
  nshades: 128,
}).reverse();

/**
 * @type { Fireball[] }
 */
let fireballs = [];

/**
 * 
 * @param { HTMLCanvasElement } canvas 
 */
const addEventListeners = (canvas) => {
  const width = canvas.width;
  const height = canvas.height;

  canvas.addEventListener('click', (ev) => {
    const clientRect = canvas.getBoundingClientRect();
    const x = (ev.clientX - canvas.offsetLeft) * (width / clientRect.width);
    const y = (ev.clientY - canvas.offsetTop) * (height / clientRect.height);
    mousePos.x = x;
    mousePos.y = y;
    emit = !emit;
  });
};

class Fireball {

  /**
   * 
   * @param { number } x 
   * @param { number } y 
   */
  constructor(x, y) {
    this.age = 0;
    this.timespan = random.range(2, 5);
    this.size = random.range(30, 60);
    this.vy = 0;
    this.vx = random.range(-5, 5);
    this.cidx = 0;
    this.x = x;
    this.y = y;
  }

  get active() {
    return this.age < this.timespan;
  }

  /**
   * 
   * @param { number } deltaTime 
   */
  update(deltaTime) {
    if (!this.active) {
      return;
    }
    this.age += deltaTime;
    this.cidx = Math.floor(math.mapRange(this.age, 0, this.timespan, 0, colors.length - 1, true));
    this.y += this.vy;
    this.x += this.vx;
    this.vx *= drag;
    this.vy += acc;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = colors[this.cidx];
    ctx.fill();
  }

}

const sketch = ({ canvas, width, height }) => {
  addEventListeners(canvas);
  const fireSources = Array(numSources).fill(0).map((_, i) => ({
    x: Math.random() * width,
    y: (Math.random() + 1) * height * 0.5,
  }));
  let pf = 0;

  return ({ context, deltaTime, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.filter = 'blur(5px)';

    fireballs.forEach(f => {
      f.update(deltaTime);
      f.draw(context);
    });
    fireballs = fireballs.filter(f => f.active);
    if (pf !== frame && emit) {
      fireSources.forEach(source => {
        fireballs.push(new Fireball(source.x, source.y));
      });
      pf = frame;
    }
  };
};

canvasSketch(sketch, settings);
