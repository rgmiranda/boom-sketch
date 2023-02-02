import { mapRange } from 'canvas-sketch-util/math';
const { Vector } = require('./vector');

const d = 0.98;
const k = 0.5;
const c = 0.8;
const repelRadius = 22500;
const ratioRadius = 250000;

export class Particle {
  constructor({x, y, radius, color}) {
    /** @type { Vector } */
    this.pos = new Vector(x, y);
    /** @type { Vector } */
    this.origin = this.pos.copy();
    /** @type { Vector } */
    this.acc = new Vector(0, 0);
    /** @type { Vector } */
    this.vel = new Vector(0, 0);
    /** @type { number } */
    this.radius = radius;
    /** @type { string } */
    this.color = color;
    this.scale = 1;
  }

  /**
   * 
   * @param { Vector } force 
   */
  applyForce(force) {
    this.acc.add(force);
  }

  attract() {
    const force = this.origin.copy();
    force.sub(this.pos);
    if (force.mag === 0) {
      return;
    }
    force.mult(k / force.mag);
    this.applyForce(force);
  }

  repel(x, y) {
    const dx = this.pos.x - x;
    const dy = this.pos.y - y;
    if (dx * dx + dy * dy > repelRadius) {
      return;
    }
    const force = new Vector(dx, dy);
    force.mult(c / force.mag);
    this.applyForce(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.mult(d);
    this.pos.add(this.vel);
    this.acc.mult(0);
    const dx = this.pos.x - this.origin.x;
    const dy = this.pos.y - this.origin.y;
    this.scale = mapRange(dx * dx + dy * dy, 0, ratioRadius, 1, 5, true);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  createDrawingPath(context) {
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.scale * this.radius, 0, 2 * Math.PI);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    this.createDrawingPath(context);
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.stroke();
    context.fill();
  }
}
export class Hexagon extends Particle {

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  createDrawingPath(context) {
    let phi, x, y;
    const angleStep = Math.PI / 3;

    context.beginPath();

    phi = -Math.PI / 2;
    x = this.pos.x + Math.cos(phi) * this.scale * this.radius;
    y = this.pos.y + Math.sin(phi) * this.scale * this.radius;
    context.moveTo(x, y);

    for (let i = 1; i < 6; i++) {
      phi += angleStep;
      x = this.pos.x + Math.cos(phi) * this.scale * this.radius;
      y = this.pos.y + Math.sin(phi) * this.scale * this.radius;
      context.lineTo(x, y);
    }

    context.closePath();
  }
}
