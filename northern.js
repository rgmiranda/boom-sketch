const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const color = require('canvas-sketch-util/color');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `northern-${seed}`,
  animate: true,
};
const numPoints = 512;
const dist = 4;
const noiseFreq = 0.001
const noiseAmp = Math.PI * 0.5;
const lightSize = 500;
const colors = createColormap({
  colormap: 'winter',
  nshades: 24,
  format: 'rgb'
});
console.log(colors);

const sketch = () => {
  return ({ context, width, height, frame }) => {
    let x, y, a, ratio, gradient;
    const pathOrigins = [0.25, 0.5, 0.75];
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    gradient = context.createLinearGradient(0, 0, 0, -lightSize);
    colors.forEach((c, i) =>  {
      const [r, g, b] = c;
      const a = i < (colors.length * 0.5) ? math.mapRange(i, 0, colors.length * 0.5 - 1, 0, 1) : math.mapRange(i, colors.length * 0.5, colors.length - 1, 1, 0);
      gradient.addColorStop(i / (colors.length - 1), color.style([r, g, b, a]));
    });

    pathOrigins.forEach(yo => {
      const o = random.rangeFloor(0, 1000);
      x = 0;
      y = height * yo;
      for (let i = 0; i < numPoints; i++) {
        ratio = math.mapRange(i, 0, numPoints * 0.2, 0.01, 1);
        a = random.noise2D(i + o, frame, ratio * noiseFreq, noiseAmp);
        x += Math.cos(a) * dist;
        y += Math.sin(a) * dist;
        context.save();
        context.translate(x, y);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(0, 0, 2, 0, Math.PI * 2);
        context.fill();
  
        context.beginPath();
        context.moveTo(0, - lightSize);
        context.lineTo(-2, 0);
        context.lineTo(2, 0);
        context.closePath();
        context.fill();
        context.restore();
      }
    });

  };
};

canvasSketch(sketch, settings);
