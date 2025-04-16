const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `black-water-${seed}`,
};

const freq = 0.02;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number[] } angles 
 * @param { boolean } rotate 
 */
const drawCuadrant = (context, width, height, angles, rotate = false) => {
  context.save();
  
  context.translate(width * 0.5, height * 0.5);
  if (rotate) {
    context.rotate(Math.PI);
  }

  context.beginPath();
  context.moveTo(0, 0);
  angles.forEach((a, i) => {
    context.save();
    context.rotate(a);
    context.lineTo(i, 0);
    context.restore();
  });
  
  const lastRadius = angles.length - 1;
  const lastAngle = angles[lastRadius];
  
  context.arc(0, 0, lastRadius, lastAngle, lastAngle + Math.PI * 0.5);
  angles.reverse().forEach((a, i) => {
    context.save();
    context.rotate(a);
    context.lineTo(0, angles.length - 1 - i);
    context.restore();
  });
  angles.reverse();
  context.closePath();
  context.fillStyle = 'white';
  context.fill();

  context.restore();
}

const sketch = () => {
  return ({ context, width, height }) => {

    random.setSeed(seed);

    /** @type { number[] } */
    const angles = [];
    for (let i = 0; i < width * 0.75; i++) {
      angles.push(random.noise1D(i, freq, Math.PI * 0.5));
    }

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    drawCuadrant(context, width, height, angles);
    //drawCuadrant(context, width, height, angles, true);
  };
};

canvasSketch(sketch, settings);
