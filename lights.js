const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const { Vector } = require('./calc');
const color = require('canvas-sketch-util/color');
const math = require('canvas-sketch-util/math');

const rows = 16;
const cols = 16;
const lensSize = 10;
const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `lights-${Date.now()}`
};
const colors = createColormap({
  colormap: 'jet',
  nshades: rows,
});

/**
 * 
 * @param { Vector } walker 
 * @param { HTMLCanvasElement } canvas
 */
function addListeners(walker) {
  window.addEventListener('mousemove', e => {
    walker.x = e.clientX;
    walker.y = e.clientY;
  });
}

const sketch = ({ width, height, canvas }) => {
  const lightSize = Math.max(width, height) * 0.5;
  const walker = new Vector(random.rangeFloor(0, width), random.rangeFloor(0, height));
  const sw = width / cols;
  const sh = height / rows;
  const lens = [];
  addListeners(walker, canvas);
  for (let i = 0; i < rows; i++) {
    const y = sh * (i + 0.5);
    for (let j = 0; j < cols; j++) {
        const x = sw * (j + 0.5);
        lens.push({
          color: colors[i],
          pos: new Vector(x, y),
        });
    }
  }
  return ({ context, width, height }) => {

    context.clearRect(0, 0, width, height);
    lens.forEach(l => {
      const light = l.pos.copy();
      light.sub(walker);
      const initColor = color.parse(l.color).rgba;
      initColor[3] = math.mapRange(light.mag, 0, lightSize, 1, 0);

      context.save();
      context.translate(l.pos.x, l.pos.y);
      context.fillStyle = color.parse(initColor).hex;
      context.strokeStyle = l.color;
      context.lineWidth = lensSize;
      
      context.globalCompositeOperation = 'destination-over';
      
      context.beginPath();
      context.arc(0, 0, lensSize * 0.5, 0, Math.PI * 2);
      context.fill();
      
      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, light.mag);
      gradient.addColorStop(0, color.parse(initColor).hex);
      gradient.addColorStop(1, `${l.color}00`);
      
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = gradient;
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(light.x, light.y);
      context.stroke();
      context.restore();
      
    })
    
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
  };
};

canvasSketch(sketch, settings);
