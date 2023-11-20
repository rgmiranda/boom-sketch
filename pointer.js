const canvasSketch = require('canvas-sketch');
const { Vector } = require('./calc');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'pointer',
  animate: true,
};

const cols = rows = 16;
const mousePos = new Vector(0, 0);

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 */
const addEventListeners = (canvas) => {
  window.addEventListener('mousemove', ev => {
    const x = (ev.offsetX / canvas.offsetWidth) * canvas.width;
    const y = (ev.offsetY / canvas.offsetHeight) * canvas.height;
    mousePos.x = x;
    mousePos.y = y;
  });
};

/**
 * @param { number } width 
 * @param { number } height 
 * @param { CanvasRenderingContext2D } context 
 */
const draw = (width, height, context) => {
  const pw = width / cols;
  const ph = height / rows;

  for (let i = 0; i < rows; i++) {
    const y = (i + 0.5) * ph;
    for (let j = 0; j < cols; j++) {
      const x = (j + 0.5) * pw;
      context.save();
      context.translate(x, y);
      if (mousePos.mag > 0) {
        const pos = new Vector(x, y);
        const diff = mousePos.copy();
        diff.sub(pos);
        if (mousePos.x < pos.x) {
          context.rotate(Math.PI);
        }
        context.rotate(diff.angle);
      }
      if (mousePos.x > x - pw * 0.5
        && mousePos.x < x + pw * 0.5
        && mousePos.y > y - ph * 0.5
        && mousePos.y < y + ph * 0.5) {

        context.beginPath();
        context.arc(0, 0, pw * 0.25, 0, Math.PI * 2);
        context.fillStyle = '#f15060';
        context.fill();
      } else {
        context.fillStyle = '#435060';
        context.beginPath();
        context.moveTo(pw * 0.5, 0);
        context.lineTo(-pw * 0.5, ph * 0.25)
        context.lineTo(-pw * 0.5, -ph * 0.25)
        context.closePath();
        context.fill();
      }
      context.restore();
    }
  }
};

const sketch = ({ canvas }) => {
  addEventListeners(canvas);
  return ({ context, width, height }) => {
    context.fillStyle = '#f6eee3';
    context.fillRect(0, 0, width, height);
    draw(width, height, context);
  };
};

canvasSketch(sketch, settings);
