import { offsetHSL } from 'canvas-sketch-util/color';
import { mapRange } from 'canvas-sketch-util/math';

const friction = 0.7;
const ease = 0.01;
const repelRadius = 80000;
const ratioRadius = 80000;

export class Particle {
  constructor({x, y, radius, color}) {
    this.pos = {x, y};
    this.origin = {x, y};
    this.acc = {x: 0, y: 0};
    this.vel = { x: 0, y: 0 };
    this.radius = radius;
    this.color = color;
    this.scale = 1;
  }

  applyForce(force) {
    this.acc.x += force.x;
    this.acc.y += force.y;
  }

  attract() {
    const dx = this.origin.x - this.pos.x;
    const dy = this.origin.y - this.pos.y;
    const force = {x: dx * ease, y: dy * ease};
    this.applyForce(force);
  }

  repel(x, y) {
    const dx = this.pos.x - x;
    const dy = this.pos.y - y;
    const distance = dx * dx + dy * dy;
    if (distance > repelRadius) {
      return;
    }
    const angle = Math.atan2(dy, dx);
    const strength = repelRadius / distance;
    const force = {
      x: Math.cos(angle) * strength,
      y: Math.sin(angle) * strength,
    }
    this.applyForce(force);
  }

  update() {
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.vel.x *= friction;
    this.vel.y *= friction;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
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
    const color = offsetHSL(this.color, 0, 0, (this.scale - 1) * 15).hex;
    context.fillStyle = color;
    context.strokeStyle = color;
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

export class Square extends Particle {

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  createDrawingPath(context) {
    context.beginPath();
    context.rect(this.pos.x - this.radius * 0.5, this.pos.y - this.radius * 0.5, this.radius, this.radius);
    context.closePath();
  }
}
