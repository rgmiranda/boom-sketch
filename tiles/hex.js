const canvasSketch = require('canvas-sketch');
const { noise2D, noise3D } = require('canvas-sketch-util/random');
const createColormap = require('colormap');

const tileSize = 50;
const padding = 0;
const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'hex-tiles'
};

const nshades = 128;
const colormap = 'magma';
const colors = createColormap({
  colormap,
  nshades,
  alpha: 1,
  format: 'hex'
});

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } x 
 * @param { number } y 
 * @param { number } size 
 * @param { number } sides 
 * @param { string } color
 */
function drawShape(context, x, y, size, sides, color) {
  let angle = - Math.PI * 0.5;
  const angleStep = Math.PI * 2 / sides;
  context.save();

  context.translate(x, y);
  context.beginPath();

  context.moveTo(0, -size);
  for (let i = 0; i < sides; i++) {
    angle += angleStep;
    context.lineTo(Math.cos(angle) * size, Math.sin(angle) *  size);
  }
  context.closePath();

  context.fillStyle = color;
  context.fill();

  context.restore();
}

const sketch = ({ width, height }) => {

  const rows = Math.ceil((height - 2 * padding) / (tileSize) / 0.6);
  const cols = Math.ceil((width - 2 * padding) / (tileSize) / 0.7);

  const tiles = [];
  for (let j = 0; j < rows; j++) {
    const offset = (j % 2) === 0 ? 0 : tileSize * 0.5;
    const y = (j * tileSize + padding - tileSize * 0.5) * 0.707;
    for (let i = 0; i < cols - ((j % 2) === 0 ? 0 : 1); i++) {
      const x = (i * tileSize + padding  + offset - tileSize * 0.5) * 0.86;
      tiles.push({
        x,
        y,
      });
    }
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    let color, n;
    for (let i = 0; i < tiles.length; i++) {
      n = Math.floor(noise3D(tiles[i].x, tiles[i].y, frame * 10, 0.001, nshades * 0.5) + nshades * 0.5);
      color = colors[n];
      drawShape(context, tiles[i].x, tiles[i].y, tileSize * 0.5, 6, color);
    }
  };
};

canvasSketch(sketch, settings);
