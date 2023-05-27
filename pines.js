const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `pines-${Date.now()}`
};

const numLayers = 16;
const layerPadding = 10;
const numPines = 16;
const backPineHeight = 500;
const frontPineHeight = 200;
const heightVar = 100;
const widthVar = 25;
const backPineWidth = 200;
const frontPineWidth = 50;
const colors = createColormap({
  colormap: 'bone',
  nshades: numLayers * 2,
  format: 'hex',
  alpha: 1
});

const sketch = () => {
  return ({ context, width, height, canvas }) => {
    let h, w, midHeight, midWidth, x, y;
    y = 700;
    const shorePos = y + layerPadding * (numLayers - 1);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#FFF';
    context.beginPath();
    context.arc(random.rangeFloor(0, width), y - backPineHeight, 50, 0, Math.PI * 2);
    context.fill();
    for (let i = 0; i < numLayers; i++) {
      context.fillStyle = colors[numLayers - i - 1];
      midHeight = math.mapRange(i, 0, numLayers - 1, backPineHeight, frontPineHeight);
      midWidth = math.mapRange(i, 0, numLayers - 1, backPineWidth, frontPineWidth);
      for (let j = 0; j < numPines; j++) {
        h = random.rangeFloor(midHeight - heightVar, midHeight + heightVar);
        w = random.rangeFloor(midWidth - widthVar, midWidth + widthVar);
        x = random.rangeFloor(0, width);
        
        context.beginPath();
        context.moveTo(x - w * 0.5, y);
        context.lineTo(x, y - h);
        context.lineTo(x + w * 0.5, y);
        context.closePath();
        context.fill();
      }
      y += layerPadding;
    }

    const cv = document.createElement('canvas');
    cv.width = width;
    cv.height = shorePos;
    const ctx = cv.getContext('2d');
    ctx.scale(1, -1);
    ctx.translate(0, -shorePos);

    ctx.filter = 'blur(5px)'
    ctx.drawImage(canvas, 0, 0, width, shorePos, 0, 0, width, shorePos);
    
    context.drawImage(cv, 0, shorePos);

    for (let i = 0; i < numLayers * numPines; i++) {
      w = random.rangeFloor(50, 100);
      x = random.rangeFloor(0, width);
      y = random.rangeFloor(shorePos, width);
      context.strokeStyle = random.pick(colors);
      context.beginPath();
      context.moveTo(x - w * 0.5, y);
      context.lineTo(x + w * 0.5, y);
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
