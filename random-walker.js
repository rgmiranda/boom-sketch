const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const risoColors = require('riso-colors');
const seed = random.getRandomSeed();

random.setSeed(seed);

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `random-walker-${seed}`
};

const cols = rows = 128;
const lineWidth = 2;
/*
const colors = [
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
];
*/
const colors = createColormap({
  colormap: 'bone',
  nshades: 16
})

const sketch = ({ context, width, height }) => {

  const grid = Array(cols * rows).fill(0);
  const pad = width / cols;

  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  const walker = {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows),
  }
  
  context.strokeStyle = random.pick(colors);
  do {
    grid[walker.y * cols + walker.x] = 1;
    const availablePoints = [
    
      { x: walker.x - 1, y: walker.y },
      { x: walker.x + 1, y: walker.y },
      { x: walker.x, y: walker.y - 1 },
      { x: walker.x, y: walker.y + 1 },
    
     /*
     { x: walker.x - 1, y: walker.y - 1 },
     { x: walker.x - 1, y: walker.y + 1 },
     { x: walker.x + 1, y: walker.y - 1 },
     { x: walker.x + 1, y: walker.y + 1 },
     */
    ].filter(p => p.x < cols && p.x >= 0 && p.y < rows && p.y >= 0 && grid[p.y * cols + p.x] === 0);
    
    context.lineWidth = lineWidth;
    context.lineCap = 'round'
    
    if (availablePoints.length === 0) {
      context.beginPath();
      context.lineWidth = lineWidth * 0.5;
      context.arc((walker.x + 0.5) * pad, (walker.y + 0.5) * pad, lineWidth * 0.25, 0, Math.PI * 2);
      context.stroke();
      const nidx = random.pick(grid.map((v, i) => ({v, i})).filter(e => e.v === 0).map(e => e.i));
      if (nidx === undefined) {
        console.log(grid);
        break;
      }
      context.strokeStyle = random.pick(colors);
      walker.x = nidx % cols;
      walker.y = Math.floor(nidx / rows);
    } else {
      const nxt = random.pick(availablePoints);
      context.beginPath();
      context.moveTo((walker.x + 0.5) * pad, (walker.y + 0.5) * pad);
      context.lineTo((nxt.x + 0.5) * pad, (nxt.y + 0.5) * pad);
      context.stroke();
      walker.x = nxt.x;
      walker.y = nxt.y;
    }
  } while (grid.filter(v => v === 0).length > 0);
    
  return ({ context, width, height }) => {
  };
};

canvasSketch(sketch, settings);
