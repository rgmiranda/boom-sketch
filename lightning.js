const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const colormap = 'autumn';
const numColors = 9;
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `lightning-${colormap}-${numColors}-${seed}`
};

const splitChance = 0.005;

/** @type { string[] } */
const colors = createColormap({
  colormap,
  nshades: numColors
}).reverse();

class Trace {

  /**
   * 
   * @param { number } ox 
   * @param { number } height 
   * @param { string } color
   * @param { number } lineWidth
   */
  constructor(ox, height, color, lineWidth) {
    this.x = ox;
    this.y = 0;
    this.height = height;
    this.color = color;
    this.lineWidth = lineWidth;

    this.previous = undefined;
  }

  /**
   * @returns { boolean }
   */
  get isActive() {
    return this.y < this.height;
  }

  move() {
    if (!this.isActive) {
      return;
    }

    const angle = random.range(0, Math.PI);
    this.previous = {
      x: this.x,
      y: this.y,
    };
    this.x = this.x + Math.cos(angle) * random.range(this.lineWidth, this.lineWidth * 2);
    this.y = this.y + Math.sin(angle) * random.range(this.lineWidth, this.lineWidth * 2);
  }

  /**
   * @returns { Trace }
   */
  split() {
    let colorIdx = colors.indexOf(this.color);
    if (colorIdx < colors.length - 1) {
      colorIdx++;
    }
    const trace = new Trace(this.x, this.height, colors[colorIdx], random.range(1, 5));
    trace.y = this.y;
    return trace;
  }

  /**
   * @param { CanvasRenderingContext2D } ctx
   */
  draw (ctx) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = 'round'
    ctx.beginPath();
    if (this.previous) {
      ctx.moveTo(this.previous.x, this.previous.y);
      ctx.lineTo(this.x, this.y);
    } else {
      ctx.arc(this.x, this.y, this.lineWidth * 0.5)
    }
    ctx.stroke();
  }
}


const sketch = ({ width, height }) => { 
  return ({ context }) => {
    let falling = 0;
    random.setSeed(seed);
    
    /** @type { Trace[] } */
    const traces = [
      new Trace(width * 0.25, height, random.pick(colors), 4),
      new Trace(width * 0.5, height, random.pick(colors), 4),
      new Trace(width * 0.75, height, random.pick(colors), 4),
    ];
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    do {
      let i = 0;
      while (i < traces.length) {
        const trace = traces[i];
        if (trace.isActive) {
          if (random.chance(splitChance)) {
            const newTrace = trace.split();
            traces.push(newTrace);
          }
          trace.move();
          trace.draw(context)
        }
        i++;
      }
      falling = traces.filter(trace => trace.isActive).length;
    } while (falling > 0);
  };
};

canvasSketch(sketch, settings);
