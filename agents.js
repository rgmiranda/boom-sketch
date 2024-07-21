const canvasSketch = require('canvas-sketch');
const { mapRange, clamp } = require('canvas-sketch-util/math');
const { Vector } = require('@rgsoft/math');

const cvWidth = cvHeight = 1080;
const numAgents = 32;
const displayRadius = 200;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};

class Agent {

  /**
   * 
   * @param { number } width 
   * @param { number } height 
   */
  constructor(width, height) {
    const velocityAngle = Math.random() * Math.PI * 2;
    this.acc = new Vector(0, 0);
    this.velocity = new Vector(Math.cos(velocityAngle), Math.sin(velocityAngle));
    this.pos = new Vector(Math.random() * width, Math.random() * height);
    this.radius = Math.random() * 5 + 10;
    this.width = width;
    this.height = height;
  }

  update() {
    this.velocity.add(this.acc);
    this.pos.add(this.velocity);
    this.acc.mult(0);

    if (this.pos.x - this.radius > this.width) {
      this.pos.x = -this.radius;
    } else if ( this.pos.x + this.radius < 0 ) {
      this.pos.x = this.width + this.radius;
    }

    if (this.pos.y - this.radius > this.height) {
      this.pos.y = -this.radius;
    } else if ( this.pos.y + this.radius < 0 ) {
      this.pos.y = this.height + this.radius;
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.fill();
    ctx.stroke();
  }

  /**
   * 
   * @param { Agent } agent 
   */
  attract(agent) {
    const force = agent.pos.copy();
    const dx = force.x - this.pos.x;
    const dy = force.y - this.pos.y;
    force.normalize();
    force.mult(clamp(1/(dx * dx + dy * dy), 0, 1));
    this.acc.add(force);
  }
}

/** @type { Agent[] } */
const agents = [];

const sketch = ({ width, height }) => {
  for (let i = 0; i < numAgents; i++) {
    agents.push(new Agent(width, height));
  }
  return ({ context, width, height }) => {
    let agent, other, dist, dx, dy;

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);    

    for (let i = 0; i < numAgents - 1; i++) {
      agent = agents[i];
      for (let j = i + 1; j < numAgents; j++) {
        other = agents[j];
        dx = agent.pos.x - other.pos.x;
        dy = agent.pos.y - other.pos.y;
        dist = dx * dx + dy * dy;
        if ( dist > displayRadius * displayRadius) {
          continue;
        }
        agent.attract(other);
        other.attract(agent);
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.lineWidth = Math.floor(mapRange(dist, 0, displayRadius * displayRadius, 5, 1));
        context.stroke();

      }
    }
    context.lineWidth = 4;

    for (agent of agents) {
      agent.update();
      agent.draw(context);
    }
  };
};

canvasSketch(sketch, settings);
