const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'sanctum'
};

const innerRadius = 150;
const outerRadius = 500;
const step = 0.1

/** @type { {x: number, y: number }[] } */
const parts = [];

/** @type { {x: number, y: number }[] } */
const oppositeParts = [];

let i = 0;
let radius = innerRadius;
while (radius < outerRadius + i) {
  parts.push({
    x: Math.cos(step * i) * radius,
    y: Math.sin(step * i) * radius,
  });
  oppositeParts.push({
    x: Math.cos(-step * i) * radius,
    y: Math.sin(-step * i) * radius,
  });
  radius *= 1.075;
  i++;
}
parts.push({
  x: Math.cos(step * i) * radius,
  y: Math.sin(step * i) * radius,
});
oppositeParts.push({
  x: Math.cos(-step * i) * radius,
  y: Math.sin(-step * i) * radius,
});


/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawMesh = (context, width, height) => {
  const angles = 18;
  const angle = 2 * Math.PI / angles;
  context.save();
  context.strokeStyle = 'black';
  context.lineCap = 'round';
  
  context.translate(width * 0.5, height * 0.5);
  for (let i = 0; i < angles; i++) {
    let px = innerRadius;
    let py = 0;
    parts.forEach(({ x, y }, k) => {
      context.lineWidth = (k + 1) * 2;
      context.beginPath();
      context.moveTo(px, py);
      context.lineTo(x, y);
      context.stroke();
      px = x;
      py = y;
    });
    
    px = innerRadius;
    py = 0;
    oppositeParts.forEach(({ x, y }, k) => {
      context.lineWidth = (k + 1) * 2;
      context.beginPath();
      context.moveTo(px, py);
      context.lineTo(x, y);
      context.stroke();
      px = x;
      py = y;
    });
    context.rotate(angle);
  }

  context.restore();

};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawRing = (context, width, height) => {
  context.save();

  for (let i = 0; i < 1024 * 256; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * (outerRadius - innerRadius) + innerRadius;
    const size = Math.random() * 0.5 + 0.5;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    context.beginPath();
    context.arc(width * 0.5 + x, height * 0.5 + y, size, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
  }

  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawRing(context, width, height);
    drawMesh(context, width, height);
  };
};

canvasSketch(sketch, settings);
