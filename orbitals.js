const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'orbitals'
};


const numOrbits = 8;
const colors = Array(numOrbits).fill(0).map( () => random.pick(risoColors).hex);

class Orbit {
  constructor (radius, pad, color) {
    this.radius = radius;
    this.speed = random.range(0.025, 0.075);
    this.age = 0;
    this.pad = pad;
    this.angularSpeed = random.range(0.01, 0.05);
    this.angle = 0;
    this.color = color;
  }

  update() {
    this.age += this.speed;
    this.angle += this.angularSpeed;
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  draw(context) {
    context.save();

    context.lineWidth = 16;
    context.strokeStyle = this.color;

    context.globalCompositeOperation = 'destination-over'

    context.beginPath();
    context.ellipse(0, 0, this.radius, this.radius * Math.abs(Math.cos(this.age)), this.angle, Math.PI, Math.PI * 2);
    context.stroke();

    context.globalCompositeOperation = 'source-over'

    context.beginPath();
    context.ellipse(0, 0, this.radius, this.radius * Math.abs(Math.cos(this.age)), this.angle, 0, Math.PI);
    context.stroke();

    context.restore();
  }

}

const sketch = ({ width }) => {
  const orbitPad = 0.45 * width / numOrbits;
  const orbits = Array(numOrbits).fill(0).map((e, i) =>
    new Orbit(orbitPad * (1 + i), orbitPad, colors[i]));
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    
    orbits.forEach(orbit => {
      orbit.update();
      orbit.draw(context);
    });

    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'white';
    context.fillRect(-width * 0.5, -height * 0.5, width, height);

  };
};

canvasSketch(sketch, settings);
