const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
const { Pane } = require('tweakpane');

const cvWidth = cvHeight = 1200;
const params = {
  text: 'F',
  fontSize: cvHeight,
  sampleFactor: 0.05,
  pointSize: 15,
  font: undefined,
  springMag: 0.05,
  friction: 0.9,
}
const pane = new Pane();
pane.addInput(params, 'text');
pane.addInput(params, 'fontSize', { min: 100, max: cvHeight * 2, step: 1 });
pane.addInput(params, 'sampleFactor', { min: 0.001, max: 0.1, step: 0.001 });
pane.addInput(params, 'pointSize', { min: 1, max: 200, step: 1 });
pane.addInput(params, 'springMag', { min: 0.01, max: 0.1, step: 0.01 });
pane.addInput(params, 'friction', { min: 0.1, max: 0.99, step: 0.01 });
pane.on('change', (ev) => {
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
    this.dragged = false;
    this.pos = p5.createVector(x, y);
    this.origin = p5.createVector(x, y);
    this.vel = p5.createVector(0, 0);
    this.acc = p5.createVector(0, 0);
    this.p5 = p5;
    this.radius = params.pointSize;
  }

  mousePressed() {
    const dx = this.pos.x - this.p5.mouseX;
    const dy = this.pos.y - this.p5.mouseY;
    if (dx * dx + dy * dy < this.radius * this.radius) {
      this.dragged = true;
      this.mouseDragged();
    } else {
      this.dragged = false;
    }
  }

  mouseReleased() {
    this.dragged = false;
  }

  mouseDragged() {
    if (!this.dragged) {
      return;
    }
    this.pos.x = this.p5.mouseX;
    this.pos.y = this.p5.mouseY;
  }

  draw() {
    const f = this.p5.map(this.pos.dist(this.origin), 0, 250, 1, 0.5, true);
    this.p5.circle(this.pos.x, this.pos.y, this.radius * 2 * f);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {

    if (this.dragged) {
      this.acc.mult(0);
      return;
    }

    const disp = this.origin.copy();
    disp.sub(this.pos);
    disp.mult(params.springMag);
    this.applyForce(disp);

    this.vel.add(this.acc);
    this.vel.mult(params.friction);
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
    this.connections = [];
    for (let i = 0; i < this.points.length - 1; i++) {
      this.connections.push(this.points[i].origin.dist(this.points[i + 1].origin));
    }
    this.connections.push(this.points[this.points.length - 1].origin.dist(this.points[0].origin));
  }

  mousePressed() {
    this.points.forEach(p => p.mousePressed());
  }

  mouseReleased() {
    this.points.forEach(p => p.mouseReleased());
  }
  
  mouseDragged() {
    this.points.filter(p => p.dragged).forEach(p => p.mouseDragged());
  }
  
  draw() {
    this.points.forEach(p => p.draw());
  }

  update() {
    let force, mag, i, j, k;
    for (i = 0; i < this.points.length; i++) {
      if ( i === 0) {
        j = this.points.length - 1;
      } else {
        j = i - 1;
      }
      if (i === this.points.length - 1) {
        k = 0;
      } else {
        k = i + 1;
      }
      force = this.points[i].pos.copy();
      force.sub(this.points[k].pos);
      mag = force.mag() - this.connections[i];
      force.normalize();
      force.mult(mag * params.springMag);
      this.points[k].applyForce(force);

      force = this.points[i].pos.copy();
      force.sub(this.points[j].pos);
      mag = force.mag() - this.connections[j];
      force.normalize();
      force.mult(mag * params.springMag);
      this.points[j].applyForce(force);
    }
    this.points.forEach(p => p.update());
  }
}

canvasSketch(({ width, height, p5 }) => {
  textPointsManager = new TextPointsManager(p5);
  textPointsManager.setParams({width, height, ...params});
  p5.mousePressed = () => textPointsManager.mousePressed();
  p5.mouseDragged = () => textPointsManager.mouseDragged();
  p5.mouseReleased = () => textPointsManager.mouseReleased();

  return ({ p5 }) => {
    p5.background(0);
    p5.noStroke();
    textPointsManager.update();
    textPointsManager.draw();
  };
}, settings).then(manager => sketchManager = manager);
