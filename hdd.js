const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `hdd-${seed}`
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } radius 
 */
const drawDisc = (context, width, height, radius) => {
  const rotation = random.range(0, Math.PI * 2);
  const slice = random.range(Math.PI * 0.125, Math.PI * 0.5);

  context.save();
  context.translate(width * 0.5, height * 0.5);
  context.rotate(rotation);
  const grad = context.createConicGradient(0, 0, 0);
  grad.addColorStop(0, '#000');
  grad.addColorStop(0.5, '#FFF');
  grad.addColorStop(1, '#000');
  context.beginPath();
  context.moveTo(0, 0);
  context.arc(0, 0, radius, slice * 0.5, 2 * Math.PI - slice * 0.5);
  context.closePath();
  context.fillStyle = grad;
  context.fill();
  context.restore();
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } radius 
 */
const drawCenter = (context, width, height, radius) => {
  context.save();
  context.translate(width * 0.5, height * 0.5);
  context.beginPath();
  context.arc(0, 0, radius, 0, 2 * Math.PI);
  context.closePath();
  context.fillStyle = '#000';
  context.fill();
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    const discs = [
      Math.SQRT1_2,
      0.65,
      0.55,
      0.45,
      0.35,
      0.25,
      0.15,
    ];
    const center = 0.05;
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    for (const radius of discs) {
      drawDisc(context, width, height, radius * width);
    }
    drawCenter(context, width, height, center * width);
  };
};

canvasSketch(sketch, settings);
