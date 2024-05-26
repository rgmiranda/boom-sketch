const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'stargate',
  animate: true,
  fps: 24,
};

const colors = createColormap({
  colormap: 'hsv',
  nshades: 16,
  alpha: 1,
  format: 'hex'
})

const sketch = () => {
  const lineRatio = 1.05;
  let lines = [2];
  const lineTimespan = 5;
  let elapsedTime = 0;
  let pf = -1;
  return ({ context, width, height, deltaTime, frame }) => {
    
    elapsedTime += pf !== frame ? 1 : 0;
    if (elapsedTime > lineTimespan) {
      lines.push(2);
      elapsedTime = 0;
    }
    
    if (pf !== frame) {
      context.fillStyle = 'black';
      context.strokeStyle = 'white';
      context.fillRect(0, 0, width, height);
      for (let i = 0; i < lines.length; i++) {
        lines[i] *= lineRatio;
        context.beginPath();
        context.arc( width * 0.5, height * 0.5, lines[i], 0, Math.PI * 2);
        context.stroke();
      }
      pf = frame;
    }
    lines = lines.filter(v => v < width * Math.SQRT1_2);
  };
};

canvasSketch(sketch, settings);
