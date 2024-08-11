const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `horizon-${seed}`,
};

const colors = ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8"].reverse();

const noiseFreq = 0.0005;
const noiseAmp = 250;
const lineWidth = 5;

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    const pad = height / colors.length;
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    colors.forEach((c, i) => {
      const offset = random.range(0, 10) / noiseFreq;
      for (let x = random.rangeFloor(-lineWidth, 0); x <= width; x += lineWidth * 2) {
        const y = pad * (i + 0.5)
        + random.noise2D(x + offset, i + offset, noiseFreq, noiseAmp)
        + random.noise2D(x - offset, i - offset, noiseFreq * 10, noiseAmp / 10)
        + random.noise2D(x + offset, i + offset, noiseFreq * 20, noiseAmp / 20)
        + random.noise2D(x - offset, i - offset, noiseFreq * 40, noiseAmp / 40)
        + random.noise2D(x + offset, i + offset, noiseFreq * 80, noiseAmp / 80)
        + random.noise2D(x + offset, i + offset, noiseFreq * 160, noiseAmp / 50)
        ;
        context.beginPath();
        context.moveTo(x, height);
        context.lineTo(x, y);
        
        context.lineWidth = lineWidth * 2;
        context.strokeStyle = 'white';
        context.stroke();
        context.lineWidth = lineWidth;
        context.strokeStyle = c;
        context.stroke();
      }
    });
  };
};

canvasSketch(sketch, settings);
