const { Vector } = require('@rgsoft/math');
const { QuadTree, Rect, Circle } = require('@rgsoft/quadtree');
const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const perceptionRadius = 50;

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  fps: 12
};

class Boid {
  /**
   * 
   * @param { number } x 
   * @param { number } y 
   * @param { Rect } boundary 
   */
  constructor (x, y, boundary) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(random.range(-4, 4), random.range(-4, 4));
    this.acceleration = new Vector(0, 0);
    this.steeringForce = random.range(0.3, 0.5);
    this.maxSpeed = random.range(3, 7);
    this.boundary = boundary;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    if (this.position.x < this.boundary.x) {
      this.position.x += this.boundary.w;
    } else if (this.position.x > (this.boundary.x + this.boundary.w)) {
      this.position.x -= this.boundary.w;
    }
    if (this.position.y < this.boundary.y) {
      this.position.y += this.boundary.h;
    } else if (this.position.y > (this.boundary.y + this.boundary.h)) {
      this.position.y -= this.boundary.h;
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.beginPath();
    context.fillStyle = 'black';
    context.arc(this.x, this.y, 3, 0, Math.PI * 2);
    context.fill();
  }

  /**
   * 
   * @param { Vector } velocity 
   */
  steer(velocity) {
    const steer = velocity.copy();
    steer.mag = this.maxSpeed;
    steer.sub(this.velocity);
    steer.mag = this.steeringForce;
    this.acceleration.add(steer);
  }

  /**
   * 
   * @param { Vector } p 
   */
  seek(p) {
    const steer = Vector.sub(p, this.position);
    this.steer(steer);
  }

  /**
   * 
   * @param { Vector } p 
   */
  flee(p) {
    const steer = Vector.sub(this.position, p);
    this.steer(steer);
  }

  /**
   * 
   * @param { Boid[] } neighbors 
   */
  flock(neighbors) {
    if (!Array.isArray(neighbors) || neighbors.length === 0) {
      return;
    }

    const center = new Vector(0, 0);
    const avgVelocity = new Vector(0, 0);
    const apart = new Vector(0, 0);
    neighbors.forEach((ob) => {
      const dx = ob.position.x - this.position.x;
      const dy = ob.position.y - this.position.y;
      const d = dx * dx + dy * dy;

      center.add(ob.position);
      avgVelocity.add(ob.velocity);
      if (d !== 0) {
        apart.add(Vector.sub(this.position, ob.position).div(d));
      }
    });
    center.div(neighbors.length);
    avgVelocity.div(neighbors.length);
    apart.div(neighbors.length);
    this.seek(center);
    this.steer(apart);
    this.steer(avgVelocity);
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { QuadTree } quadtree 
 */
const drawQuadtree = (context, quadtree) => {
  context.beginPath();
  context.rect(quadtree.boundary.x, quadtree.boundary.y, quadtree.boundary.w, quadtree.boundary.h);
  context.stroke();

  const quadrants = quadtree.getQuadrants();
  if (quadrants) {
    quadrants.forEach(q => drawQuadtree(context, q));
  }
};

const sketch = ({ width, height }) => {
  const boundary = new Rect(0, 0, width, height);
  const boids = Array(1500).fill(0).map(() => new Boid(random.range(0, width), random.range(0, height), boundary));
  return ({ context }) => {
    const quadtree = new QuadTree(5, boundary);
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let b of boids) {
      quadtree.addPoint(b);
    }
    drawQuadtree(context, quadtree);

    boids.forEach((b) => {
      const closeBoids = quadtree.query(new Circle(b.x, b.y, perceptionRadius)).filter(ob => ob !== b);
      b.flock(closeBoids);
      b.update();
      b.draw(context);
    });
  };
};

canvasSketch(sketch, settings);
