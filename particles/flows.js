const canvasSketch = require('canvas-sketch');
const { noise2D, noise3D, range, noise1D } = require('canvas-sketch-util/random');
const { Vector } = require('../calc');

const rows = 32;
const cols = 32;
const noiseScale = 0.1;
const noiseAmp = Math.PI;
const particleCount = 512;

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

class Particle {
  constructor(x, y, width, height) {
    this.pos = new Vector(x, y);
    this.trail = [];
    this.width = width;
    this.height = height;
  }

  move(angle) {
    const vel = new Vector(Math.cos(angle), Math.sin(angle));
    vel.mult(2);
    this.pos.add(vel);
    if ( this.pos.x >= this.width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = this.width - 1;
    }
    if ( this.pos.y >= this.height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = this.height - 1;
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(this.pos.x, this.pos.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

}

/**
 * 
 * @param { number } frame 
 * @returns 
 */
function generateField(frame) {
  const field = [];
  let angle, x, y;

  for (let i = 0; i < cols * rows; i++) {
    x = i % cols;
    y = Math.floor(i / cols);
    //angle = noise3D(x, y, frame * 0.1, noiseScale, noiseAmp);
    angle = Math.cos(x) + Math.sin(y);  
    field.push(angle);
  }
  return field;
}

/**
 * @param { Array } field
 * @param { CanvasRenderingContext2D } context 
 * @param { number } colWidth 
 * @param { number } rowHeight
 */
function drawField(field, context, colWidth, rowHeight) {
  let x, y, angle;
  for (let i = 0; i < rows * cols; i++) {
    x = (i % cols) * colWidth;
    y = Math.floor(i / cols) * rowHeight;
    angle = field[i];

    context.save();
    context.translate(x + colWidth * 0.5, y + rowHeight * 0.5);
    context.beginPath();
    context.moveTo(0, 0)
    context.lineTo(Math.cos(angle) * colWidth * 0.5, Math.sin(angle) * rowHeight * 0.5);
    context.stroke();

    context.beginPath();
    context.rect(-colWidth * 0.5, -rowHeight * 0.5, colWidth, rowHeight);
    context.stroke();

    context.restore();
  }
}

const sketch = ({ width, height }) => {
  const rowHeight = height / rows;
  const colWidth = width / cols;
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(range(0, width), range(0, height), width, height));
  } 
  return ({ context, width, height, frame }) => {
    context.strokeStyle = 'black';
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.lineWidth = 2;
    
    const field = generateField(frame);
    drawField(field, context, colWidth, rowHeight);

    particles.forEach(p => {
      const i = Math.floor(p.pos.x / colWidth);
      const j = Math.floor(p.pos.y / rowHeight);

      const angle = field[j * cols + i];
      
      p.move(angle);
      p.draw(context);
/*
      context.beginPath();
      context.strokeStyle = 'red';
      context.rect(i * colWidth, j * rowHeight, colWidth, rowHeight);
      context.stroke();

      context.save();
      context.translate(i * colWidth + colWidth * 0.5, j * rowHeight + rowHeight * 0.5);
      context.beginPath();
      context.moveTo(0, 0)
      context.lineTo(Math.cos(angle) * colWidth * 0.5, Math.sin(angle) * rowHeight * 0.5);
      context.stroke();
      context.restore();*/
    });

  };
};

canvasSketch(sketch, settings);
