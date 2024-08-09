const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `loathing-${Date.now()}`
};


const numSprings = 12;
const numWheels = 12;
const springAngle = 2 * Math.PI / numSprings;
const wheelOffset = 5;
const turnAmp = Math.PI * 0.5;
const turnSpeed = 0.02;
const colors = createColormap({
  colormap: 'inferno',
  nshades: numSprings,
}).sort((a, b) => random.chance(0.5) ? -1 : 1);

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } outerRadius 
 * @param { number } innerRadius 
 * @param { number } outerOffsetAngle 
 * @param { number } innerOffsetAngle 
 */
const drawWheel = (ctx, outerRadius, innerRadius, outerOffsetAngle, innerOffsetAngle) => {

  for (let i = 0; i < numSprings; i++) {
    const outerAngle = i * springAngle - outerOffsetAngle;
    const innerAngle = i * springAngle - innerOffsetAngle;
    const x0 = Math.cos(outerAngle) * outerRadius;
    const y0 = Math.sin(outerAngle) * outerRadius;
    const x1 = Math.cos(outerAngle + springAngle) * outerRadius;
    const y1 = Math.sin(outerAngle + springAngle) * outerRadius;
    const x2 = Math.cos(innerAngle + springAngle) * innerRadius;
    const y2 = Math.sin(innerAngle + springAngle) * innerRadius;
    const x3 = Math.cos(innerAngle) * innerRadius;
    const y3 = Math.sin(innerAngle) * innerRadius;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.strokeStyle = colors[i];
    ctx.fill();
    ctx.stroke();
  }
};

const sketch = () => {
  return ({ context, frame, width, height }) => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    
    context.translate(width * 0.5, height * 0.5);

    let currentRadius = width * 0.75;
    const wheelPad = currentRadius / numWheels;

    for (let i = 0; i < numWheels - 1; i++) {
      const outerOffsetAngle = random.noise1D(frame + i * wheelOffset, turnSpeed, turnAmp);
      const innerOffsetAngle = random.noise1D(frame + (i + 1) * wheelOffset, turnSpeed, turnAmp);
      drawWheel(context, currentRadius, currentRadius - wheelPad, outerOffsetAngle, innerOffsetAngle);
      currentRadius -= wheelPad;
    }
  };
};

canvasSketch(sketch, settings);
