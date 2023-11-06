const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const eases = require('eases');
const { Vector } = require('./calc');
const createColormap = require('colormap');
const seed = random.getRandomSeed();
const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `slashes-${seed}`
};

const numSplits = 8;
const splitSize = 30;

let sketchManager;

const colors = createColormap({
  colormap: 'plasma',
  nshades: 24,
});

function addEventListeners()
{
  window.addEventListener('click', (ev) =>
  {
    if (sketchManager.props.playing)
    {
      sketchManager.pause();
    } else
    {
      sketchManager.play();
    }
  })
}

/**
 * 
 * @param { CanvasRenderingContext2D } context
 * @param { Vector[] } path
 * @param { Vector } diff
 * @param { number } width
 * @param { number } height
 */
const drawSplit = (context, path, diff, width, height, splitWidth) => {

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
  context.translate(diff.x * splitWidth, diff.y * splitWidth);
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
  addEventListeners();
  const splits = Array(numSplits).fill(0).map(() => {
    const path = [];
    let angleOffset;
    if (random.chance(0.5)) {
      path.push(new Vector(random.range(0, width) - width * 0.5, - height * 0.5));
      path.push(new Vector(random.range(0, width) - width * 0.5, height * 0.5));
      if (random.chance(0.5)) {
        path.push(new Vector(width * 0.5, height * 0.5));
        path.push(new Vector(width * 0.5, -height * 0.5));
        angleOffset = -Math.PI * 0.5;
      } else {
        path.push(new Vector(-width * 0.5, height * 0.5));
        path.push(new Vector(-width * 0.5, -height * 0.5));
        angleOffset = Math.PI * 0.5;
      }
    } else {
      path.push(new Vector(- width * 0.5, random.range(0, height) - height * 0.5));
      path.push(new Vector(width * 0.5, random.range(0, height) - height * 0.5));
      if (random.chance(0.5)) {
        path.push(new Vector(width * 0.5, height * 0.5));
        path.push(new Vector(-width * 0.5, height * 0.5));
        angleOffset = Math.PI * 0.5;
      } else {
        path.push(new Vector(width * 0.5, -height * 0.5));
        path.push(new Vector(-width * 0.5, -height * 0.5));
        angleOffset = -Math.PI * 0.5;
      }
    }
    const diff = path[1].copy();
    diff.sub(path[0]);
    diff.normalize();

    return {
      path,
      diff: Vector.fromAngle(diff.angle + angleOffset)
    };
  });

  return ({context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);

    const gradient = context.createLinearGradient(0, -width * 0.45, 0, width * 0.45);
    colors.forEach((c, i) => gradient.addColorStop(i / (colors.length - 1), c));
    context.beginPath();
    context.arc(0, 0, width * 0.45, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();

    let i = 0;
    let adv = 0;
    while (i < splits.length && adv < frame) {
      const { path, diff } = splits[i];
      const localSplit = eases.circOut(Math.min(splitSize, frame - adv) / splitSize) * splitSize;
      drawSplit(context, path, diff, width, height, localSplit)
      i++;
      adv += splitSize;
    }
  };
};

canvasSketch(sketch, settings).then(manager => {
  sketchManager = manager;
  manager.pause();
});
