const { Vector } = require('@rgsoft/math');
const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const { mapRange } = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'circulate',
  animate: true,
};

/** @type { Vector[] } */
let flowField;

class Rect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  /**
   * 
   * @param { Vector } v 
   * @returns { boolean }
   */
  contains(v) {
    return this.x <= v.x && v.x <= this.x + this.w
      && this.y <= v.y && v.y <= this.y + this.h;
  }
}

class Vehicle {
  /**
   * 
   * @param { number } x 
   * @param { number } y 
   * @param { Rect } lattice 
   */
  constructor(x, y, lattice) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.lattice = lattice;
    this.maxSpeed = 10;
    this.maxForce = 0.25;
  }

  /**
   * 
   * @param { number } x 
   * @param { number } y 
   */
  seek(x, y) {
    if (x === undefined || y === undefined) {
      return;
    }
    const target = new Vector(x, y);
    const desired = Vector.sub(target, this.position);
    desired.mag = this.maxSpeed;
    let steer = Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    this.apply(steer);
  }

  /**
   * 
   * @param { Vector[] } field
   * @param { number } cols 
   * @param { number } rows 
   */
  follow(field, cols, rows) {
    const desired = this.lookup(field, cols, rows);
    desired.mag = this.maxSpeed;
    const steer = Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    this.apply(steer);
  }


  /**
   * 
   * @param { Vector } force 
   */
  apply(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    if (this.position.x < this.lattice.x) {
      this.position.x += this.lattice.w;
    } else if (this.position.x > this.lattice.x + this.lattice.w) {
      this.position.x -= this.lattice.w;
    }

    if (this.position.y < this.lattice.y) {
      this.position.y += this.lattice.h;
    } else if (this.position.y > this.lattice.y + this.lattice.h) {
      this.position.y -= this.lattice.h;
    }
  }

  /**
   * 
   * @param { Vector[] } field 
   * @param { number } cols 
   * @param { number } rows 
   * @returns { Vector }
   */
  lookup(field, cols, rows) {
    const ix = Math.round(mapRange(
      this.position.x,
      this.lattice.x,
      this.lattice.x + this.lattice.w,
      0,
      cols - 1,
      true
    ));
    const iy = Math.round(mapRange(
      this.position.y,
      this.lattice.y,
      this.lattice.y + this.lattice.h,
      0,
      rows - 1,
      true
    ));
    return field[iy * cols + ix].copy();
  }

  /**
   *
   * @param { CanvasRenderingContext2D } context 
   */
  display(context) {
    context.beginPath();
    context.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2);
    context.closePath();
    context.fillStyle = 'gray';
    context.strokeStyle = 'black';
    context.fill();
    context.stroke();
  }
}

/**
 * 
 * @param { number } width 
 * @param { number } height 
 * @param { number } cols 
 * @param { number } rows 
 * @returns { Vector[] }
 */
const generateFlowField = (width, height, cols, rows) => {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const pw = width / cols;
  const ph = height / rows;

  return Array(cols * rows).fill(0).map((_, i) => {
    const x = (i % cols) * pw;
    const y = Math.floor(i / cols) * ph;
    const a = Math.atan2(cy - y, cx - x) + Math.PI * 0.45;
    return Vector.fromAngle(a);
  });
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } cols 
 * @param { number } rows 
 * @param { Vector[] } field 
 */
const displayField = (context, width, height, cols, rows, field) => {
  const pw = width / cols;
  const ph = height / rows;

  field.forEach((v, i) => {
    const x = (i % cols) * pw;
    const y = Math.floor(i / cols) * ph;
    context.beginPath();
    context.moveTo(x + pw * 0.5, y + ph * 0.5);
    context.lineTo(x + pw * 0.5 + v.x * pw * 0.5, y + ph * 0.5 + v.y * ph * 0.5);
    context.stroke();
  });
};

const sketch = ({ width, height }) => {
  const numVehicles = 64;
  const lattice = new Rect(0, 0, width, height);
  const vehicles = Array(numVehicles).fill(false).map(() => new Vehicle(random.range(0, width), random.range(0, height), lattice));
  const cols = 20;
  const rows = 20;
  flowField = generateFlowField(width, height, cols, rows);
  let following = true;
  window.addEventListener('click', ()  => { 
    following = !following;
  });

  return ({ context }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    vehicles.forEach(v => {
      if (following) {
        v.follow(flowField, cols, rows);
      }
      v.update();
      v.display(context);
    });
    
    //displayField(context, width, height, cols, rows, flowField);
  };
};

canvasSketch(sketch, settings);
