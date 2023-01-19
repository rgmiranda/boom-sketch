const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const color = require('canvas-sketch-util/color');

const seed = random.getRandomSeed();
random.setSeed(seed);

const cvWidth = 1080,
  cvHeight = 1080;

const settings = {
  dimensions: [cvWidth, cvHeight],
  name: seed,
  animate: true,
};

const figureColors = [
  risoColors[Math.floor(random.value() * risoColors.length)],
  risoColors[Math.floor(random.value() * risoColors.length)],
  risoColors[Math.floor(random.value() * risoColors.length)],
];

const figures = [];
const figCount = 40;
const angle = 5 * Math.PI / 6;
const bgColor = random.pick(risoColors).hex;
const polygonColor = random.pick(figureColors).hex;

class Parallelogram {

  constructor({ x, y, width, height, angle }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.rx = Math.cos(angle) * width;
    this.ry = Math.sin(angle) * width;
    this.fill = random.pick(figureColors).hex;
    this.stroke = random.pick(figureColors).hex;
    const shadow = color.offsetHSL(this.stroke, 0, 0, -20);
    shadow.rgba[3] = 0.5;
    this.shadowColor = color.style(shadow.rgba);
    this.blend = (random.boolean()) ? 'source-over' : 'overlay';
    const vmag = random.range(-5, 5);
    this.vx = Math.cos(angle) * vmag;
    this.vy = Math.sin(angle) * vmag;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {

    context.save();
    context.translate(this.x - this.rx * 0.5, this.y - (this.ry + this.height) * 0.5);

    context.fillStyle = this.fill;
    context.strokeStyle = this.stroke;
    context.lineWidth = 10;

    context.globalCompositeOperation = this.blend;
    
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.rx, this.ry);
    context.lineTo(this.rx, this.ry + this.height);
    context.lineTo(0, this.height);
    context.closePath();
    
    
    context.shadowColor = this.shadowColor;
    context.shadowOffsetX = -10;
    context.shadowOffsetY = 20;
    context.fill();
    
    context.shadowColor = undefined;
    context.stroke();

    context.globalCompositeOperation = 'source-over';
    
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.stroke();

    context.restore();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x - (this.width * 0.5) > cvWidth) {
      this.x = -this.width * 0.5;
    } else if (this.x < -this.width * 0.5) {
      this.x = cvWidth + (this.width * 0.5);
    }

    if (this.y - ((this.ry + this.height) * 0.5) > cvHeight) {
      this.y = (this.ry + this.height) * -0.5;
    } else if (this.y < - (this.ry + this.height) * 0.5) {
      this.y = cvHeight + (this.ry + this.height) * 0.5;
    }
  }
}

function drawPolygon({ context, radius, sides }) {
  const angle = 2 * Math.PI / sides;
  context.beginPath();
  context.moveTo(cvWidth * 0.5, -radius + cvHeight * 0.6);
  for (let i = 1; i < sides; i++) {
    const x = Math.cos(angle * i - Math.PI * 0.5) * radius + cvWidth * 0.5;
    const y = Math.sin(angle * i - Math.PI * 0.5) * radius + cvHeight * 0.6;
    context.lineTo(x, y);
  }
  context.closePath();
}

for (let i = 0; i < figCount; i++) {
  figures.push(new Parallelogram({
    x: random.range(0, cvWidth),
    y: random.range(0, cvHeight),
    width: Math.floor(random.range(0.2 * cvWidth, 0.8 * cvWidth)),
    height: Math.floor(random.range(0.1 * cvHeight, 0.4 * cvHeight)),
    angle
  }));
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    const radius = width * 0.45;
    const sides = 3;

    context.save();

    drawPolygon({
      context,
      radius,
      sides
    });
    context.clip();
    
    for (const f of figures) {
      f.update();
      f.draw(context);
    }

    context.restore();

    context.save();
    context.lineWidth = 20;
    context.strokeStyle = polygonColor;
    context.globalCompositeOperation = 'color-burn'
    drawPolygon({
      context,
      radius: radius - context.lineWidth,
      sides
    });
    context.stroke();
    context.restore();
  };
};

canvasSketch(sketch, settings);
