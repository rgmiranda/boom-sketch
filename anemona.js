const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const { contrastRatio } = require('canvas-sketch-util/color');
const createColormap = require('colormap');

const seed = random.getRandomSeed();
random.setSeed(seed);
const bodySize = 200;
const armParts = 16;
const numArms = 8;
const amrRatio = 0.8;
const armAngle = 2 * Math.PI / numArms;
const noiseFreq = 0.025;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `anemona-${seed}`,
  animate: true,
};

const colors = createColormap({
  colormap: 'winter',
  nshades: armParts + 1,
  alpha: 1,
  format: 'hex'
})

/**
 * 
 * @param { CanvasRenderingContext2D } context
 */
function drawArm(context, frame) {
  let prevRadius = bodySize * 0.5;
  let radius = bodySize * 0.5 * amrRatio;
  let x = 0, y = 0, angle;
  for (let i = 0; i < armParts; i++) {
    angle = random.noise1D(i - frame, noiseFreq, Math.PI * 0.75) - Math.PI * 0.75;
    x += Math.cos(angle) * prevRadius;
    y += Math.sin(angle) * prevRadius;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.strokeStyle = colors[i + 1];
    context.stroke();
    prevRadius = radius;
    radius *= amrRatio;
  }
}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = colors[0];
    context.lineWidth = 4;
    context.translate(width * 0.5, height * 0.5);
    context.beginPath();
    context.arc(0, 0, bodySize * 0.5, 0, Math.PI * 2);
    context.stroke();

    for (let i = 0; i < numArms; i++) {
      drawArm(context, frame);
      context.rotate(armAngle);
    }
  };
};

canvasSketch(sketch, settings);
