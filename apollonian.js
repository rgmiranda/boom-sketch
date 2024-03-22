const canvasSketch = require('canvas-sketch');
const { Complex } = require('./calc');

const settings = {
  dimensions: [ 1080, 1080 ],
};

let sketchManager;

/**
 * @type { Circle[][] }
 */
let triplets = [];

/**
 * @type { Circle[] }
 */
const allCircles = [];

class Circle {
  /**
   * 
   * @param { number } x 
   * @param { number } y 
   * @param { number } bend 
   */
  constructor(x, y, bend) {
    this.radius = Math.abs(1 / bend);
    this.bend = bend;
    this.center = new Complex(x, y);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.center.a, this.center.b, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/**
 * 
 * @param { Circle } c1 
 * @param { Circle } c2 
 * @param { Circle } c3
 * @returns { number[] }
 */
const descartes = (c1, c2, c3) => {
  const k1 = c1.bend;
  const k2 = c2.bend;
  const k3 = c3.bend;
  const p1 = k1 + k2 + k3
  const p2 = 2 * Math.sqrt(k1 * k2 + k2 * k3 + k3 * k1);
  return [p1 + p2, p1 - p2];
};

/**
 * 
 * @param { Circle } c1 
 * @param { Circle } c2 
 * @param { Circle } c3
 * @param { Complex[] } k4
 * @returns { Circle[] }
 */
const complexDescartes = (c1, c2, c3, k4) => {
  const k1 = c1.bend;
  const k2 = c2.bend;
  const k3 = c3.bend;
  const z1 = c1.center;
  const z2 = c2.center; 
  const z3 = c3.center;

  const zk1 = z1.mult(k1);
  const zk2 = z2.mult(k2);
  const zk3 = z3.mult(k3);

  const p1 = zk1.add(zk2).add(zk3);
  const p2 = zk1.mult(zk2).add(zk2.mult(zk3)).add(zk1.mult(zk3)).sqrt().mult(2);
  const centers = [
    p1.add(p2).div(k4[0]),
    p1.sub(p2).div(k4[1])
  ];
  return [
    new Circle(centers[0].a, centers[0].b, k4[0]),
    new Circle(centers[1].a, centers[1].b, k4[1]),
  ]
};

const processGasket = () => {
  const newTriplets = [];
  triplets.forEach(t => {
    [c1, c2, c3] = t;
    const k4 = descartes(c1, c2, c3);
    const [nc1, nc2] = complexDescartes(c1, c2, c3, k4);

    if (nc1.radius > 1 && allCircles.findIndex( c => Math.abs(c.center.a - nc1.center.a) < 1 && Math.abs(c.center.b - nc1.center.b) < 1) === -1) {
      allCircles.push(nc1);
      
      newTriplets.push([c1, c2, nc1]);
      newTriplets.push([c1, c3, nc1]);
      newTriplets.push([c2, c3, nc1]);
    }

    if (nc2.radius > 1 && allCircles.findIndex( c => Math.abs(c.center.a - nc2.center.a) < 1 && Math.abs(c.center.b - nc2.center.b) < 1) === -1) {
      allCircles.push(nc2);
      
      newTriplets.push([c1, c2, nc2]);
      newTriplets.push([c1, c3, nc2]);
      newTriplets.push([c2, c3, nc2]);
    }
  });
  triplets = newTriplets;
};

const addListeners = () => {
  window.addEventListener('click', () => {
    processGasket();
    sketchManager.render();
  });
};

const sketch = ({ width, height }) => {
  
  let r1 = width * 0.48;
  let c1 = new Circle(width * 0.5, height * 0.5, -1 / r1);

  let r2 = 0.25 * r1;
  let r3 = 0.75 * r1;

  let c2 = new Circle(width * 0.5 - r1 + r2, height * 0.5, 1 / r2);
  let c3 = new Circle(width * 0.5 + r1 - r3, height * 0.5, 1 / r3);
  allCircles.push(c1);
  allCircles.push(c2);
  allCircles.push(c3);
  triplets = [
    [c1, c2, c3]
  ];

  addListeners();

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    allCircles.forEach(c => c.draw(context));
  };
};

canvasSketch(sketch, settings).then(manager => {
  sketchManager = manager;
});
