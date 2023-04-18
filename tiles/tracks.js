const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');


const seed = random.getRandomSeed();
random.setSeed(seed);
const cols = 16;
const rows = 16;
const circles = 10;
const settings = {
  dimensions: [ 1080, 1080 ],
  name: `circle-tiles-${seed}`
};
const bg = '#F2EECB';
const fg = '#1E293B';

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 * @param { number } width 
 * @param { number } height 
 * @param { number } circles
 */
function drawTile(context, x, y, angle, width, height, circles) {
  const circlePadding = Math.min(width, height) / (circles + 1);
  context.save();

  context.translate(x + width * 0.5, y + height * 0.5);
  context.rotate(angle);
  context.beginPath();
  context.rect(-width * 0.5, -height * 0.5, width, height);
  context.clip();

  for (let i = 0; i < circles; i++) {
    context.beginPath();
    context.arc(-width * 0.5, -height * 0.5, circlePadding * (i + 1), 0, Math.PI * 0.5);
    context.stroke();
  }
  context.shadowColor = fg;
  context.shadowBlur = width * 0.1;
  for (let i = circles - 1; i >= 0; i--) {
    context.beginPath();
    context.moveTo(width * 0.5, height * 0.5);
    context.arc(width * 0.5, height * 0.5, circlePadding * (i + 1), Math.PI, Math.PI * 1.5);
    context.fill();
    context.shadowColor = undefined;
    context.shadowBlur = 0;
    context.beginPath();
    context.arc(width * 0.5, height * 0.5, circlePadding * (i + 1), Math.PI, Math.PI * 1.5);
    context.stroke();
  }

  context.restore();
}

const sketch = ({ width, height }) => {

  const tw = width / cols;
  const th = height / rows;
  const tiles = [];
  for (let j = 0; j < rows; j++) {
    const y = j * th;
    for (let i = 0; i < cols; i++) {
      const x = i * tw;
      const angle = Math.PI * random.pick([0, 0.5, 1, 1.5]);
      tiles.push({
        x,
        y,
        angle,
      });
    }
  }

  return ({ context, width, height }) => {
    context.fillStyle = bg;
    context.strokeStyle = fg;
    context.lineWidth = 2;
    context.fillRect(0, 0, width, height);
    let x, y, angle;
    for (let i = 0; i < tiles.length; i++) {
      ({x, y, angle} = tiles[i]);
      drawTile(context, x, y, angle, tw, th, circles);
    }
  };
};

canvasSketch(sketch, settings);
