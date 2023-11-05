const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { Vector } = require('./calc');
const seed = random.getRandomSeed();
const settings = {
  dimensions: [ 1080, 1080 ]
};

const numSplits = 2;
const splitSize = 10;

/**
 * 
 * @param { CanvasRenderingContext2D } context
 * @param { Vector[] } path
 * @param { Vector } diff
 * @param { number } width
 * @param { number } height
 */
const drawSplit = (context, path, diff, width, height) => {

  const imageData = context.getImageData(0, 0, width, height);

  /** @type { HTMLCanvasElement } */
  const cv = document.createElement('canvas');
  cv.width = width;
  cv.height = height;
  
  /** @type { CanvasRenderingContext2D } */
  const ctx2 = cv.getContext('2d');
  ctx2.putImageData(imageData, 0, 0);

  context.save();
  context.beginPath();
  context.moveTo(path[0].x, path[0].y);
  context.lineTo(path[1].x, path[1].y);
  context.lineTo(path[2].x, path[2].y);
  context.lineTo(path[3].x, path[3].y);
  context.closePath();
  context.clip();
  context.fillStyle = 'black';
  context.fill();
  context.restore();

  context.save();
  context.translate(diff.x * splitSize, diff.y * splitSize);
  context.beginPath();
  context.moveTo(path[0].x, path[0].y);
  context.lineTo(path[1].x, path[1].y);
  context.lineTo(path[2].x, path[2].y);
  context.lineTo(path[3].x, path[3].y);
  context.closePath();
  context.clip();
  context.drawImage(cv, -width * 0.5, -height * 0.5);

  context.restore();
};

const sketch = ({ width, height }) => {
  random.setSeed(seed);
  const splits = Array(numSplits).fill(0).map(() => {
    const path = [];
    if (random.chance(0.5)) {
      path.push(new Vector(random.range(0, width) - width * 0.5, - height * 0.5));
      path.push(new Vector(random.range(0, width) - width * 0.5, height * 0.5));
      if (random.chance(0.5)) {
        path.push(new Vector(width * 0.5, height * 0.5));
        path.push(new Vector(width * 0.5, -height * 0.5));
      } else {
        path.push(new Vector(-width * 0.5, height * 0.5));
        path.push(new Vector(-width * 0.5, -height * 0.5));
      }
    } else {
      path.push(new Vector(- width * 0.5, random.range(0, height) - height * 0.5));
      path.push(new Vector(width * 0.5, random.range(0, height) - height * 0.5));
      if (random.chance(0.5)) {
        path.push(new Vector(width * 0.5, height * 0.5));
        path.push(new Vector(-width * 0.5, height * 0.5));
      } else {
        path.push(new Vector(width * 0.5, -height * 0.5));
        path.push(new Vector(-width * 0.5, -height * 0.5));
      }
    }
    const diff = path[1].copy();
    diff.sub(path[0]);
    diff.normalize();

    return {
      path,
      diff: Vector.fromAngle(diff.angle + Math.PI * 0.5)
    };
  });
  return ({context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, height * 0.5);
    context.beginPath();
    context.arc(0, 0, width * 0.45, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();

    splits.forEach(s => drawSplit(context, s.path, s.diff, width, height));

  };
};

canvasSketch(sketch, settings);
