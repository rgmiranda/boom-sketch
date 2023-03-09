const canvasSketch = require('canvas-sketch');
const { offsetHSL, parse } = require('canvas-sketch-util/color');
const p5 = require('p5');
const { Pane } = require('tweakpane');

const cvWidth = cvHeight = 1200;
const color = [243, 243, 21];
let font;
const params = {
  text: 'NEON',
  fontSize: cvHeight * 0.33,
  sampleFactor: 0.5,
  lineWidth: 8,
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
  font = p5.loadFont('fonts/neon.ttf');
};

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  dimensions: [cvWidth, cvHeight],
  animate: true,
};

let blinkAge = 0;

canvasSketch(() => {
  return ({ p5, width, height }) => {
    const textBounds = font.textBounds(params.text, 0, 0, params.fontSize);
    if (blinkAge === 0) {
      if (p5.random() < 0.02) {
        blinkAge = p5.floor(p5.random() * 10) + 5;
      }
    } else {
      blinkAge--;
    }

    let dx = (width - textBounds.w - textBounds.x) * 0.5;
    let dy = (height - textBounds.y) * 0.5;

    const chars = params.text.split('');
    let charBounds;

    /** @type { CanvasRenderingContext2D } */
    const ctx = p5.drawingContext;
    const [r, g, b] = color;

    p5.background(0);
    p5.strokeWeight(params.lineWidth);
    p5.textFont(font);
    p5.textSize(params.fontSize);


    chars.forEach((char, idx) => {
      charBounds = font.textBounds(char, 0, 0, params.fontSize);
      if (blinkAge > 0 && idx === 0) {
        p5.stroke(33);
        p5.fill(51);
        ctx.shadowBlur = 0;
        ctx.shadowColor = undefined;
        p5.text(char, dx, dy);
        dx += charBounds.w;
        return;
      }
      p5.stroke(p5.color(r, g, b, 51));
      p5.fill(255);
      ctx.shadowColor = parse(color).hex;
      ctx.shadowBlur = 100;
      p5.text(char, dx, dy);
      ctx.shadowBlur = 200;
      p5.text(char, dx, dy);
      ctx.shadowBlur = 300;
      p5.text(char, dx, dy);
      dx += charBounds.w;
    })
  };
}, settings).then(manager => sketchManager = manager);
