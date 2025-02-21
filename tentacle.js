const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'tentacle',
  animate: true,
};

const amp = 40;
const freq = 0.005;
const radius = 60;
const size = 120;
const colors = createColormap({
  colormap: 'magma',
  nshades: 9,
});

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } color 
 * @param { number } i 
 * @param { number } j 
 * @param { number } k 
 * @param { number } frame 
 */
const drawCircle = (context, color, i, j, k, frame) => {
  const angle = random.noise3D(i * 2.5, 20 * j + 2 * frame, 20 * k + 2 * frame, freq, Math.PI);
  const r = i * amp / (0.75 * colors.length - 1);
  context.beginPath();
  context.arc(Math.cos(angle) * r, Math.sin(angle) * r, radius * (colors.length - i) / (colors.length), 0, Math.PI * 2);
  context.strokeStyle = color;
  //context.fill();
  context.stroke();
};

const sketch = ({ width, height }) => {
  const cols = Math.ceil(width / size);
  const rows = Math.ceil(height / size);
  return ({ context, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.lineWidth = 1;
    
    for (let i = 0; i < rows; i ++) {
      for (let j = 0; j < cols; j++) {
        context.save();
        context.translate((j + 0.5) * size, (i + 0.5) * size);
        colors.forEach((color, k) => {
          drawCircle(context, color, k, i, j, frame)
        });
        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings);
