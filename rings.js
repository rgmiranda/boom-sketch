const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');
const createColormap = require('colormap');
const eases = require('eases');

const lineWidth = 40;
const speed = 0.02;
const delay = 1;

const colors = createColormap({
  colormap: 'jet',
  nshades: 12,
});

const settings = {
  dimensions: [1080, 1080],
  name: `rings-${colors.length}`,
  animate: true,
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } radius 
 * @param { number } color 
 * @param { number } prop 
 */
const drawSemicircle = (context, radius, color, prop) => {
  context.beginPath();
  context.ellipse(0, 0, math.clamp(radius * prop, radius, 1), radius, 0, Math.PI * 0.5, 3 * Math.PI * 0.5);
  context.strokeStyle = color;
  context.stroke();
};

const sketch = ({ width, height }) => {
  const radius = width * 0.45;
  const circles = Array(colors.length).fill(0).map((_, i) => Math.PI * i * speed)

  return ({ context, deltaTime }) => {
    context.clearRect(0, 0, width, height);
    context.lineWidth = lineWidth;
    
    context.save();
    context.translate(width * 0.5, height * 0.5);
    
    context.globalCompositeOperation = 'lighter';
    for (let i = 0; i < circles.length; i++) {
      const prop = eases.circOut(Math.sin(circles[i]) * 0.5 + 0.5);
      drawSemicircle(context, radius, colors[i], prop);
      circles[i] += speed;
    }
    context.rotate(Math.PI);
    for (let i = circles.length - 1; i >= 0; i--) {
      const prop = eases.circOut(Math.sin(circles[i]) * 0.5 + 0.5);
      drawSemicircle(context, radius, colors[i], prop);
    }
    
    context.restore();

    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
