const canvasSketch = require('canvas-sketch');
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
const colors = createColorMap({
  colormap,
  nshades,
  format: 'hex',
  alpha: 1
});

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
  let y, lineWidth, lineColor;
  for (let i = 0; i < numLines; i ++) {
    y = (i + 1) * linePadding;
    lineColor = colors[i];
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
/*
    context.save();
    angle = Math.PI * 0.5;
    context.rotate(angle);
    angle = -Math.PI * 0.5;
    context.translate(translations[1].x, translations[1].y);
    context.beginPath();
    context.moveTo(width * 0.5 + Math.cos(angle) * radius, height * 0.5 + Math.sin(angle) * radius);
    for (let i = 1; i < 3; i++) {
      angle += Math.PI * 2 / 3;
      context.lineTo(width * 0.5 + Math.cos(angle) * radius, height * 0.5 + Math.sin(angle) * radius);
    }
    context.closePath();
    context.clip();

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (const c of lines) {
      c.draw(context);
    }
    context.restore();*/

  };
};

canvasSketch(sketch, settings);
