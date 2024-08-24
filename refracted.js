const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `refracted-${Date.now()}`,
};

const colors = createColormap({
  colormap: 'jet',
  nshades: 16,
}).reverse();

const numSplits = 28;

/**
 * 
 * @param { number } width 
 * @param { number } height 
 * @returns { HTMLCanvasElement }
 */
const drawRing = (width, height) => {
  const radius = width * 0.35;
  const cx = width * 0.5;
  const cy = height * 0.5;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  const gradient = context.createLinearGradient(
    cx,
    cy - radius,
    cx,
    cy + radius,
  );
  colors.forEach((c, i, arr) => gradient.addColorStop(i / (arr.length - 1), c));

  context.fillStyle = gradient;
  
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.fill();

  for (let b = 5; b < 75; b += 5) {
    context.filter = `blur(${b}px)`;
    context.fill();
  }

  return canvas;
};

const sketch = () => {
  return ({ context, width, height }) => {
    let sy, dy; 
    const dx = 0;
    const dh = height / numSplits;
    const dw = width
    const sh = 4 * height / numSplits;
    const sw = width;
    const sx = 0;

    const img = drawRing(width, height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    for (let i = 0; i < numSplits; i++) {
      sy = (numSplits - i - 1) * dh - sh * 0.375;
      //sy = i * dh - sh * 0.375;
      dy = i * dh;
      context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }

  };
};

canvasSketch(sketch, settings);
