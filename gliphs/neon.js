const canvasSketch = require('canvas-sketch');
const { offsetHSL, parse } = require('canvas-sketch-util/color');
const p5 = require('p5');
const { Pane } = require('tweakpane');

const cvWidth = cvHeight = 1200;
const color = [243, 243, 21];
const params = {
  text: 'NEON',
  fontSize: cvHeight * 0.33,
  sampleFactor: 0.5,
  lineWidth: 8,
  font: undefined,
}
const pane = new Pane();
pane.addInput(params, 'text');
pane.addInput(params, 'fontSize', { min: 100, max: cvHeight * 2, step: 1 });
pane.addInput(params, 'sampleFactor', { min: 0.001, max: 0.9, step: 0.001 });
pane.addInput(params, 'lineWidth', { min: 1, max: 200, step: 1 });
pane.on('change', (ev) => {
  const [width, height] = sketchManager.props.dimensions;
  textPointsManager.setParams({width, height, ...params});
  sketchManager.render();
});

let sketchManager;
let textPointsManager;

const preload = p5 => {
  params.font = p5.loadFont('fonts/neon.ttf');
};

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  dimensions: [cvWidth, cvHeight]
};

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
    
    const textBounds = font.textBounds(this.text, 0, 0, this.fontSize);
    let dx = (width - textBounds.w - textBounds.x) * 0.5;
    let dy = (height - textBounds.y) * 0.5;
    let charBounds;
    const chars = text.split('');
    this.charsPoints = [];
    chars.forEach(c => {
      charBounds = font.textBounds(c, 0, 0, this.fontSize);
      this.charsPoints.push(font.textToPoints(c, dx, dy, this.fontSize, { sampleFactor: this.sampleFactor }));
      dx += charBounds.w;
    });
  }
  
  draw() {
    /** @type { CanvasRenderingContext2D } */
    const ctx = this.p5.drawingContext;
    const [r, g, b] = color;
    this.p5.strokeWeight(params.lineWidth);
    this.p5.stroke(this.p5.color(r, g, b, 51));
    this.p5.fill(255);
    ctx.shadowColor = parse(color).hex;
    ctx.shadowBlur = 100;
    this.charsPoints.forEach(points => {
      this.p5.beginShape();
      points.forEach(p => this.p5.vertex(p.x, p.y));
      this.p5.endShape(p5.CLOSE);
    });
    
  }
}

canvasSketch(({ width, height, p5 }) => {
  textPointsManager = new TextPointsManager(p5);
  textPointsManager.setParams({width, height, ...params});

  return ({ p5 }) => {
    p5.background(0);
    textPointsManager.draw();
  };
}, settings).then(manager => sketchManager = manager);
