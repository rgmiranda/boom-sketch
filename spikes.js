const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'spikes',
};

const spikeSize = 108;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } heigth 
 * @param { number } size 
 */
const drawSpikes = (context, width, heigth, size) => {
  for (let y = 0; y < heigth; y += size) {
    const cy = (y / (heigth - size)) * size * 0.5 + size * 0.25;
    for (let x = 0; x < width; x += size) {
      const cx = (x / (width - size)) * size * 0.5 + size * 0.25;

      context.beginPath();
      context.moveTo(x + cx, y + cy);
      context.lineTo(x, y);
      context.lineTo(x + size, y);
      context.closePath();
      context.fillStyle = '#FFF';
      context.fill();

      context.beginPath();
      context.moveTo(x + cx, y + cy);
      context.lineTo(x, y);
      context.lineTo(x, y + size);
      context.closePath();
      context.fillStyle = '#BBB';
      context.fill();

      context.beginPath();
      context.moveTo(x + cx, y + cy);
      context.lineTo(x + size, y);
      context.lineTo(x + size, y + size);
      context.closePath();
      context.fillStyle = '#666';
      context.fill();

      context.beginPath();
      context.moveTo(x + cx, y + cy);
      context.lineTo(x, y + size);
      context.lineTo(x + size, y + size);
      context.closePath();
      context.fillStyle = '#222';
      context.fill();
    }
  }
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    drawSpikes(context, width, height, spikeSize);
  };
};

canvasSketch(sketch, settings);
