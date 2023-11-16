const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const random = require('canvas-sketch-util/random');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `land-${seed}`,
};

const colors =createColormap({
  colormap: 'copper',
  nshades: 9,
}).reverse();

const noiseFreq = 0.0005;
const noiseAmp = 150;

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    const pad = height / colors.length;
    context.fillStyle = '#FFEEAA';
    context.fillRect(0, 0, width, height);
    
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(width * 0.5, 75, 75, 0, Math.PI * 2);
    context.fill();

    colors.forEach((c, i) => {
      const offset = random.range(0, 10) / noiseFreq;
      context.beginPath();
      context.moveTo(0, height);
      for (let x = 0; x <= width; x += 2) {
        const y = pad * (i + 0.5)
        + random.noise2D(x + offset, i + offset, noiseFreq, noiseAmp)
        + random.noise2D(x - offset, i - offset, noiseFreq * 10, noiseAmp / 10)
        + random.noise2D(x + offset, i + offset, noiseFreq * 20, noiseAmp / 20)
        + random.noise2D(x - offset, i - offset, noiseFreq * 40, noiseAmp / 40)
        + random.noise2D(x + offset, i + offset, noiseFreq * 80, noiseAmp / 80)
        ;
        context.lineTo(x, y);
      }
      context.lineTo(width, height);
      context.closePath();
      context.fillStyle = c;
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
