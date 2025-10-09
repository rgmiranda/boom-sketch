const canvasSketch = require('canvas-sketch');
const { getGliphImageData, getDataBrightness } = require('../images');
const { math } = require('canvas-sketch-util');
const { Vector } = require('@rgsoft/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'grid-gliph'
};

const cellSize = 20;

const sketch = async ({ width, height }) => {

  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const gliphData = getGliphImageData('P', 'monospace', cols, rows);
  const imageBrightness = getDataBrightness(gliphData);
  const cx = width * 0.5;
  const cy = height * 0.5;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  return (
    /** @param {{ context: CanvasRenderingContext2D }} param0 */
    ({ context }) => {
      context.lineWidth = 2;
      context.fillStyle = 'black';
      context.fillRect(0, 0, width, height);
      context.fillStyle = 'white';

      for (let j = 0; j < rows; j ++) {
        const y = (j + 0.5) * cellSize;
        for (let i = 0; i < cols; i++) {
          const x = (i + 0.5) * cellSize;
          const dir = new Vector(x - cx, y - cy);
          const intensity = imageBrightness[j * cols + i] / 255;
          const r = intensity * cellSize * 0.1  + cellSize * 0.15;
          const mag = intensity * cellSize * 6 * dir.mag / maxDist;
          dir.mag = mag;

          context.beginPath();
          context.arc(x + dir.x, y + dir.y, r, 0, Math.PI * 2);
          context.fill();
        }
      }

      //context.putImageData(gliphData, 0, 0);
    }
  );
};

canvasSketch(sketch, settings);
