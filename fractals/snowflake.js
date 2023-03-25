const canvasSketch = require('canvas-sketch');
const { Vector } = require('../calc');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const { clamp, mapRange } = require('canvas-sketch-util/math');

const seed = random.getRandomSeed();
random.setSeed(seed);
let sketchManager;
const snowflakeSides = 24;
const snowflakeVertex = 32;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `snowflake-${seed}`,
  animate: true,
};

const colors = createColormap({
  colormap: 'hsv',
  nshades : snowflakeVertex,
  alpha: 1,
  format: 'hex'
})

class Walker {
  constructor(x, y, vertex) {
    this.pos = new Vector(x, y);
    this.vertexNum = vertex;
    this.currVertex = 0;
    this.distanceRatio = 0.9;
    this.active = true;
  }
  
  getDirection(){
    const k = mapRange(this.currVertex, 0, this.vertexNum, 0.75, 1)
    return random.range(-k * Math.PI, k * Math.PI);
  }

  getDistance() {
    if (this.distance === undefined) {
      this.distance = random.range(100, 200);
      return this.distance;
    }

    this.distance *= this.distanceRatio;
    this.distance = clamp(50, 200);
    return this.distance;
  }

  getSpeed() {
    return random.range(3, 5);
  }

  move() {
    if (!this.active) {
      return;
    }

    this.prev = {x: this.pos.x, y: this.pos.y};
    const distance = this.getDistance();
    const dir = Vector.fromAngle(this.getDirection());
    dir.mult(distance);
    this.pos.add(dir);

    this.currVertex++;
    if (this.currVertex >= this.vertexNum) {
      this.active = false;
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    if (!this.active) {
      return;
    }
    context.strokeStyle = colors[this.currVertex - 1];
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(this.pos.x, this.pos.y);
    context.lineTo(this.prev.x, this.prev.y);
    context.stroke();
  }
}

function addListeners() {
  window.addEventListener('click', () => {
    if (sketchManager === undefined) {
      return;
    }
    if (sketchManager.props.playing) {
      sketchManager.pause();
    } else {
      sketchManager.play();
    }
  });
}

const sketch = ({ canvas, context, width, height }) => {
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  const walker = new Walker(0, 0, snowflakeVertex);
  addListeners();
  return ({ context }) => {
    context.translate(width * 0.5, height * 0.5);
    context.strokeStyle = 'white';
    context.lineWidth = 4;
    context.lineCap = 'round';
    walker.move();

    context.save();
    for (let i = 0; i < snowflakeSides; i++) {
      walker.draw(context);
      
      context.save();
      context.scale(-1, 1);
      walker.draw(context);
      context.restore();
      context.rotate(2 * Math.PI / snowflakeSides);
    }
    context.restore();

  };
};

canvasSketch(sketch, settings).then(manager => sketchManager = manager);
