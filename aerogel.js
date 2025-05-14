const { Vector } = require('@rgsoft/math');
const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'aerogel',
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawCube = (context, width, height) => {
  const cubeSize = 24;
  const pixels = 48;
  const pw = width / pixels;
  const ph = height / pixels;
  const dotSize = Math.min(pw, ph) * 0.05;
  const dir = new Vector(-5, 3);
  const pos = new Vector(18, 8);
  const offset = new Vector(0, 0);
  const reps = 48;
  
  
  for (let k = 0; k < reps; k++) {
    for (let j = -8; j < pixels; j++) {
      const y = (j + 0.5) * ph + offset.y;
      for (let i = 0; i < pixels + 16; i++) {
        if (j >= pos.y && j <= pos.y + cubeSize && i >= pos.x && i <= pos.x + cubeSize) {
          context.fillStyle = 'white';
        } else {
          context.fillStyle = 'gray';
        }
        const x = (i + 0.5) * pw + offset.x;
        context.beginPath();
        context.arc(x, y, dotSize, 0, Math.PI * 2);
        context.closePath();
        context.fill();
      }
    }
    offset.add(dir);
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawCube(context, width, height);
  };
};

canvasSketch(sketch, settings);
