const canvasSketch = require('canvas-sketch');
const { offsetHSL } = require('canvas-sketch-util/color');
const { rangeFloor } = require('canvas-sketch-util/random');
const createColorMap = require('colormap');

const cvWidth = 1080;
const cvHeight = 1080;

const numRows = 128;
const numLines = 128;

const translations = [
  {
    x: 0,
    y: 0
  },
  {
    x: 0,
    y: -cvHeight
  },
  {
    x: -cvWidth,
    y: -cvHeight
  },
  {
    x: -cvWidth,
    y: 0
  },
];

const linePadding = cvWidth / (numLines + 1);
const pointPadding = cvHeight / (numRows + 1);

const nshades = numLines;
const colormap = 'magma'
const skyColors = createColorMap({
  colormap,
  nshades,
  format: 'hex',
  alpha: 1
});

const numBuildings = rangeFloor(12, 20);
const buildingsColors = createColorMap({
  colorma: 'copper',
  nshades,
  format: 'hex',
  alpha: 1
}).map(c => offsetHSL(c, 0, 0, -25).hex);

const settings = {
  dimensions: [cvWidth, cvHeight]
};

class Line {
  constructor({sx, sy, dx, dy, color, width}) {
    this.sx = sx;
    this.sy = sy;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.width = width;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {

    context.beginPath();
    context.moveTo(this.sx, this.sy);
    context.lineTo(this.dx, this.dy);
    context.strokeStyle = this.color;
    context.lineWidth = this.width;
    context.stroke();

  }
}

const lines = [];

const sketch = () => {
  let x, y, lineWidth, lineColor;
  for (let i = 0; i < numLines; i ++) {
    y = (i + 1) * linePadding;
    lineColor = skyColors[i];
    lines.push(new Line({
      sx: pointPadding,
      sy: y,  
      dx: cvWidth - pointPadding,
      dy: y,
      color: lineColor,
      width: 4,
    }));
  }
  return ({ context, width, height }) => {

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    for (const c of lines) {
      c.draw(context);
    }

    let angle = Math.PI;
    let radius = width * 0.4;
    context.save();
    context.rotate(angle);
    context.translate(translations[2].x, translations[2].y);

    context.beginPath();
    context.arc(width * 0.5, height * 0.5, radius, 0, Math.PI * 2);
    context.clip();

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (const c of lines) {
      c.draw(context);
    }
    context.restore();

    x = linePadding;
    y = height;

    context.save();

    context.beginPath();
    context.moveTo(x, y);

    let isLast = false;
    while (!isLast) {
      const h = rangeFloor(height * 0.7, height * 0.9);
      const w = rangeFloor(width / numBuildings - 10, width / numBuildings + 10);

      y = h;
      context.lineTo(x, y);
      x += w;
      if (x > width - linePadding) {
        x = width - linePadding;
        isLast = true;
      }
      context.lineTo(x, y);
    }
    context.lineTo(width - linePadding, height );
    context.clip();

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < numLines; i++) {
      x = (i + 1) * linePadding;
      y = linePadding;
      context.beginPath();
      context.moveTo(y, x);
      y = height - linePadding;
      context.lineTo(y, x);
      context.strokeStyle = buildingsColors[i];
      context.stroke();
    }
    context.restore();

  };
};

canvasSketch(sketch, settings);
