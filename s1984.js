const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: '1984'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawCrowd = (context, width, height) => {
  let circles = 8;
  let radius = 0.5 * width / circles;
  let y = height
  y -= radius;
  while (y > 0) {
    for (let i = 0; i < circles; i++) {
      context.beginPath();
      context.arc(2 * (i + 0.5) * radius, y, radius, 0, Math.PI * 2);
      context.closePath();
      context.fill();
    }
    y -= radius;
    circles += 4;
    radius = 0.5 * width / circles;
    y -= radius;
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'black';
    drawCrowd(context, width, height);
  };
};

canvasSketch(sketch, settings);
