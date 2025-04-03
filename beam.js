const { Vector } = require('@rgsoft/math');
const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'beam',
  animate: true
};

const speed = 0.01;

const colors = createColormap({
  nshades: 12,
  colormap: 'cool'
})


/**
 * 
 * @param { number } cx 
 * @param { number } cy 
 * @param { number } radius 
 * @param { number } sides 
 * @returns { Vector[] }
 */
const calculatePolygon = (cx, cy, radius, sides, angle = -Math.PI * 0.5) => {
  const innerAngle = 2 * Math.PI / sides;
  let x, y;
  /** @type { Vector[] } */
  const polygon = []
  for (let i = 0; i < sides; i++) {
    x = cx + Math.cos(innerAngle * i + angle) * radius;
    y = cy + Math.sin(innerAngle * i + angle) * radius;
    polygon.push(new Vector(x, y));
  }
  return polygon;
};


/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { Vector[] } polygon
 * @param { string } color 
 */
const drawPolygon = (context, polygon, color) => {
  context.save();
  context.beginPath();
  polygon.forEach(({ x, y }, i) => {
    if (i === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });
  context.closePath();
  context.lineWidth = 2;
  context.strokeStyle = color;
  context.stroke();
  context.restore();
  
};


/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { Vector } p 
 * @param { Vector } q 
 * @param { string | CanvasGradient } color
 * @param { number } angle 
 */
const drawBeam = (context, p, q, color, angle) => {
  context.save();
  context.translate(p.x, p.y);
  context.rotate(angle);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(q.x - p.x, q.y - p.y);
  context.strokeStyle = color;
  context.lineWidth = 16;
  context.lineCap = 'round';
  context.stroke();
  context.restore();
  
};

const sketch = ({ width, height, context }) => {
  const sides = 6;
  const radius = width * 0.48;
  const polygon = calculatePolygon(width * 0.5, height * 0.5, radius, sides);
  const innerAngle = (sides - 2) * Math.PI / sides;
  const centerAngle = 2 * Math.PI / sides;
  const sideLength = 2 * Math.sin(centerAngle * 0.5) * radius;
  let p2 = 1, p1 = 0;
  let prop = 1;
  let toggleGradient = true;

  /** @type { CanvasGradient } */
  const g1 = context.createRadialGradient(0, 0, 0, 0, 0, sideLength);

  /** @type { CanvasGradient } */
  const g2 = context.createRadialGradient(0, 0, 0, 0, 0, sideLength);
  
  colors.forEach((c, i, a) => {
    g1.addColorStop(i / (a.length - 1), c);
    g2.addColorStop((a.length - i - 1) / (a.length - 1), c);
  });
  

  return ({ context }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawPolygon(context, polygon, 'gray');
    drawBeam(context, polygon[p1], polygon[p2], toggleGradient ? g2 : g1, innerAngle * eases.bounceIn(prop));
    prop -= speed;
    if (prop < 0) {
      prop = 1;
      p1 = p2;
      p2 = (p2 + 1) % sides;
      toggleGradient = !toggleGradient;
    }
  };
};

canvasSketch(sketch, settings);
