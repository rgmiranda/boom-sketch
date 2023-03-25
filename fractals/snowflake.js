const canvasSketch = require('canvas-sketch');
const { Vector } = require('../calc');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const { clamp } = require('canvas-sketch-util/math');

const seed = random.getRandomSeed();
random.setSeed(seed);
let sketchManager;
const snowflakeSides = 6;
const snowflakeVertex = 32;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `snowflake-${seed}`,
  animate: true,
};

const colors = createColormap({
  colormap: 'winter',
  nshades : snowflakeVertex,
  alpha: 1,
  format: 'hex'
})

class Walker {
  constructor(x, y, vertex) {
    this.pos = new Vector(x, y);
    this.vertexNum = vertex;
    this.distanceRatio = 0.9;
    this.currVertex = 0;
    this.active = true;
    this.resetDest();
  }
  
  getDirection(){
    if (this.currVertex === 0) {
      return Math.PI * 0.5;
    }
    return random.range(-Math.PI, Math.PI);
  }

  getDistance() {
    if (this.distance === undefined) {
      this.distance = random.range(100, 200);
      return this.distance;
    }

    this.distance *= this.distanceRatio;
    //this.distance = clamp(20, 200);
    return this.distance;
  }

  getSpeed() {
    return random.range(3, 5);
  }

  resetDest() {

    if (!this.active) {
      return;
    }
    
    this.dest = this.pos.copy();
    const distance = this.getDistance();
    this.dir = Vector.fromAngle(this.getDirection());
    this.dir.mult(distance);
    this.dest.add(this.dir);
    this.speed = this.getSpeed();
    this.steps = Math.ceil(distance / this.speed);
    this.currStep = 0;
    this.dir.normalize();
    this.dir.mult(this.speed);
    this.prev = undefined;

    this.currVertex++;
    if (this.currVertex >= this.vertexNum) {
      this.active = false;
    }
  }

  move() {
    if (!this.active) {
      return;
    }
    if (this.currStep >= this.steps) {
      this.resetDest();
    }
    this.prev = { x: this.pos.x, y: this.pos.y };
    this.pos.add(this.dir);
    this.currStep++;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.strokeStyle = colors[this.currVertex - 1];
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
