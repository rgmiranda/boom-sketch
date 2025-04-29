const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'core'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } radius 
 * @param { number } dots 
 */
const drawLayer = (context, width, height, radius, dots) => {
  context.save();
  context.fillStyle = 'white';
  context.translate(width * 0.5, height * 0.5);
  for (let i = 0; i < dots; i++) {
    const r = radius - Math.abs(random.gaussian(0, radius * 0.05));
    const a = Math.random() * Math.PI * 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    context.beginPath();
    context.arc(x, y, 2, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    let rp = 0.08;
    let dots = 256;
    while (rp < 0.5) {
      drawLayer(context, width, height, width * rp, dots);
      dots *= 2;
      rp += 0.07;
    }
  };
};

canvasSketch(sketch, settings);
