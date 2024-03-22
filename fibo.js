const canvasSketch = require('canvas-sketch');
const risoColors = require('riso-colors');
const createColormap = require('colormap');
const { random, math } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'fibo-dark'
};

const bg = '#dbd7d2';

const colors = ["#7a4343","#522d2d","#341d1c","#2a1716","#1e1619","#11151c","#19212e","#212d40","#413c4d", "#1c2e30"];

// Pastel
//const colors = ["#fbf8cc","#fde4cf","#ffcfd2","#f1c0e8","#cfbaf0","#a3c4f3","#90dbf4","#8eecf5","#98f5e1","#b9fbc0"].reverse()

/*
const colors = createColormap({
  colormap: 'winter',
  nshades: 20,
});*/

const scale = 12;
const numArcs = colors.length;

class Slice {

  /**
   * 
   * @param { number } x 
   * @param { number } y 
   * @param { number } radius 
   * @param { number } angle
   */
  constructor(x, y, radius, angle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.angle = angle;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   * @param { string } color 
   */
  draw(ctx, color) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.radius, this.angle, this.angle + Math.PI * 0.5);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.strokeStyle = bg;
    ctx.fill();
    ctx.lineWidth = math.clamp(this.radius * 0.05, 2, 4);
    ctx.stroke();
  }
}


const slices = [
  new Slice(0, 0, scale * 1, 0),
  new Slice(0, 0, scale * 1, Math.PI * 0.5),
];

while (slices.length < numArcs) {
  const ps = slices[slices.length - 1];
  const pps = slices[slices.length - 2];
  const nr = ps.radius + pps.radius;
  const na = ps.angle + Math.PI * 0.5;
  const x = ps.x + pps.radius * Math.cos(pps.angle);
  const y = ps.y + pps.radius * Math.sin(pps.angle);
  slices.push(new Slice(x, y, nr, na));
}
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.28, height * 0.6);
    context.rotate(Math.PI);
    
    slices.forEach((slice, i) => {
      const color = colors[i];
      slice.draw(context, color);
    });
  };
};

canvasSketch(sketch, settings);
