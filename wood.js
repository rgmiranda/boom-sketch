const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `wood`
};

const inColor = '#fdf5c9 ';
const outColor = '#6B3E26';
const numRings = 24;
const noiseFreq = 0.0025;
const noiseAmp = 60;
const arcSize = 5;

const drawCrust = (context, radius) => {
  const numSlices = Math.floor(2 * Math.PI * radius / arcSize);
  const angle = 2 * Math.PI / numSlices;

  context.beginPath();

  for (let j = 0; j < numSlices; j++) {
    let x = Math.cos(angle * j) * radius;
    let y = Math.sin(angle * j) * radius;
    const offset = random.noise2D(x, y, noiseFreq, noiseAmp) +
      random.noise2D(x, y, noiseFreq * 2, noiseAmp / 2) + noiseAmp / 2 +
      random.noise2D(x, y, noiseFreq * 4, noiseAmp / 4) + noiseAmp / 4 +
      random.noise2D(x, y, noiseFreq * 8, noiseAmp / 8) + noiseAmp / 8 + 
      random.noise2D(x, y, noiseFreq * 16, noiseAmp / 16) + noiseAmp / 16 +
      random.noise2D(x, y, noiseFreq * 32, noiseAmp / 32) + noiseAmp / 32;
    if (j === 0) {
      context.moveTo(0, radius + offset);
    } else {
      context.lineTo(0, radius + offset);
    }
    context.rotate(angle);
  }
  context.closePath();
  context.fillStyle = outColor;
  context.fill();
}

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawRings = (context, width, height) => {
  const maxRadius = width * 0.4;
  const minRadius = 10;
  const ringPad = (maxRadius - minRadius) / numRings;
  
  context.save();
  context.translate(width * 0.5, height * 0.5);

  drawCrust(context, ringPad * (numRings) + minRadius);

  for (let i = numRings - 1; i >= 0; i--) {

    const radius = i * ringPad + minRadius;
    const numSlices = Math.floor(2 * Math.PI * radius / arcSize);
    const angle = 2 * Math.PI / numSlices;

    context.beginPath();

    for (let j = 0; j < numSlices; j++) {
      let x = Math.cos(angle * j) * radius;
      let y = Math.sin(angle * j) * radius;
      const offset = random.noise2D(x, y, noiseFreq, noiseAmp);
      if (j === 0) {
        context.moveTo(0, radius + offset);
      } else {
        context.lineTo(0, radius + offset);
      }
      context.rotate(angle);
    }
    context.closePath();
    context.strokeStyle = outColor;
    context.lineWidth = 5;

    context.stroke();
    if (i === numRings - 1) {
      context.fillStyle = inColor;
      context.fill();
    }

  }
  context.restore();
}

const sketch = () => {
  random.setSeed(seed);
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawRings(context, width, height);
  };
};

canvasSketch(sketch, settings);
