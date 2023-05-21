const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const ts = Date.now();

const pps = 64;
const levels = [
  {
    init: 0,
    length: Math.floor(64 * 0.2),
    size: Math.floor(64 * 1.8),
  },
  {
    init: 64,
    length: 64 * 0.22,
    size: 64 * 1.78,
  },
  {
    init: 0,
    length: 64 * 0.24,
    size: 64 * 1.76,
  },
  {
    init: 64,
    length: 64 * 0.275,
    size: 64 * 1.75,
  },
  {
    init: 0,
    length: 64 * 0.35,
    size: 64 * 1.65,
  },
  {
    init: 64,
    length: 64 * 0.5,
    size: 64 * 1.5,
  },
  {
    init: 0,
    length: 64 * 0.65,
    size: 64 * 1.35,
  },
  {
    init: 64,
    length: 64 * 0.75,
    size: 64 * 1.25,
  },
  {
    init: 0,
    length: 64 * 0.85,
    size: 64 * 1.15,
  },
  {
    init: 64,
    length: 64,
    size: 64,
  },
  {
    init: 0,
    length: 64,
    size: 64,
  },
  {
    init: 64,
    length: 64 * 1.1,
    size: 64 * 0.9,
  },
  {
    init: 0,
    length: 64 * 1.2,
    size: 64 * 0.8,
  },
  {
    init: 64,
    length: 64 * 1.4,
    size: 64 * 0.6,
  },
  {
    init: 0,
    length: 64 * 1.6,
    size: 64 * 0.4,
  },
];

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `strings-square-${ts}`,
  animate: true,
  fps: 1,
};

const colors = createColormap({
  colormap: 'copper',
  nshades: levels.length,
  alpha: 1,
  format: 'hex'
});


const sketch = ({ width, height, context }) => {
  const points = [];
  const pw = width / pps;
  const ph = height / pps;
  points.push(...Array(pps).fill(0).map((e, i) => ({x: pw * i, y: 0})));
  points.push(...Array(pps).fill(0).map((e, i) => ({x: width, y: ph * i})));
  points.push(...Array(pps).fill(0).map((e, i) => ({x: width - pw * i, y: height})));
  points.push(...Array(pps).fill(0).map((e, i) => ({x: 0, y: height - ph * i})));

  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  
  let currentLevel = 0;
  let pointOffset = 0;
  return ({ context }) => {
    if (currentLevel >= levels.length) {
      return;
    }
    const level = levels[currentLevel];
    let p1 = Math.floor(level.init + pointOffset) % points.length;
    let p2 = Math.floor(level.init + pointOffset + level.size) % points.length;
    context.strokeStyle = colors[currentLevel];
    
    context.beginPath();
    context.moveTo(points[p1].x, points[p1].y);
    context.lineTo(points[Math.floor(p2)].x, points[Math.floor(p2)].y);
    context.stroke();
    
    p1 = Math.floor(level.init + pointOffset + points.length * 0.5) % points.length;
    p2 = Math.floor(level.init + pointOffset + level.size + points.length * 0.5) % points.length;
    context.beginPath();
    context.moveTo(points[p1].x, points[p1].y);
    context.lineTo(points[Math.floor(p2)].x, points[Math.floor(p2)].y);
    context.stroke();

    pointOffset++;
    if (pointOffset >= level.length) {
      currentLevel++;
      pointOffset = 0;
    }
  };
};

canvasSketch(sketch, settings);
