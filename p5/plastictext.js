const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
const { Pane } = require('tweakpane');

const cvWidth = cvHeight = 1080;
const springCoef = 0.02;
const repelCoef = 0.05;
const params = {
  text: 'A',
  fontSize: cvHeight,
  sampleFactor: 0.05,
  pointSize: 15,
  font: undefined,
  repelRadius: 200,
}
const pane = new Pane();
pane.addInput(params, 'text');
pane.addInput(params, 'fontSize', { min: 100, max: cvHeight * 2, step: 1 });
pane.addInput(params, 'sampleFactor', { min: 0.001, max: 0.1, step: 0.001 });
pane.addInput(params, 'pointSize', { min: 1, max: 200, step: 1 });
pane.addInput(params, 'repelRadius', { min: 50, max: 500, step: 1 });
pane.on('change', () => {
  const [width, height] = sketchManager.props.dimensions;
  textPointsManager.setParams({width, height, ...params});
  sketchManager.render();
});

let sketchManager;
let textPointsManager;

const preload = p5 => {
  params.font = p5.loadFont('fonts/anton.ttf');
};

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  // Turn on a render loop
  animate: true,
  dimensions: [cvWidth, cvHeight]
};

class TextPoint {
  constructor(p5, x, y) {
    this.pos = p5.createVector(x, y);
    this.origin = p5.createVector(x, y);
    this.vel = p5.createVector(0, 0);
    this.acc = p5.createVector(0, 0);
    this.p5 = p5;
    this.radius = params.pointSize;
  }

  draw() {
    const f = this.p5.map(this.pos.dist(this.origin), 0, 250, 0.2, 2, true);
    this.p5.circle(this.pos.x, this.pos.y, this.radius * 2 * f);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  repel(x, y) {
    const dx =  this.pos.x - x;
    const dy =  this.pos.y - y;
    if (dx * dx + dy * dy > params.repelRadius * params.repelRadius) {
      return;
    }
    const force = this.p5.createVector(dx, dy);
    force.mult(repelCoef);
    this.applyForce(force);
  }

  update() {

    const disp = this.origin.copy();
    disp.sub(this.pos);
    disp.mult(springCoef);
    this.applyForce(disp);

    this.vel.add(this.acc);
    this.vel.mult(0.9);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
}

class TextPointsManager {
  constructor (p5) {
    this.p5 = p5;
  }

  setParams({ width, height, text, fontSize, font, sampleFactor }) {
    this.width = width;
    this.height = height;
    this.text = text;
    this.fontSize = fontSize;
    this.font = font;
    this.sampleFactor = sampleFactor;
    const bounds = font.textBounds(this.text, 0, 0, this.fontSize);
    const dx = (width - bounds.w - bounds.x) * 0.5;
    const dy = (height - bounds.y) * 0.5;
    /** @type { TextPoint[] } */
    this.points = font.textToPoints(this.text, dx, dy, this.fontSize, { sampleFactor: this.sampleFactor }).map(({x, y}) => new TextPoint(this.p5, x, y));
  }

  draw() {
    this.points.forEach(p => p.draw());
  }

  update() {
    this.points.forEach(p => {
      if ( this.p5.mouseIsPressed ) {
        p.repel(this.p5.mouseX, this.p5.mouseY);
      }
      p.update();
    });
  }
}

canvasSketch(({ width, height, p5 }) => {
  textPointsManager = new TextPointsManager(p5);
  textPointsManager.setParams({width, height, ...params});

  return ({ p5 }) => {
    p5.background(0);
    p5.noStroke();
    textPointsManager.update();
    textPointsManager.draw();
  };
}, settings).then(manager => sketchManager = manager);
