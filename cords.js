const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `cords-${seed}`,
};

function range(start, end, step = 1) {
  if (start === end) {
    throw new Error('Invalid range');
  }

  if (start < end && step <= 0) {
    throw new Error('Invalid range');
  }

  if (start > end && step >= 0) {
    throw new Error('Invalid range');
  }

  const a = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      a.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      a.push(i);
    }
  }
  return a;
}

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawCords = (context, width, height) => {
  const freq = 0.005;
  const step = 5;
  const cords = 32;
  const amps = Array(cords).fill(0).map((_, i) => Math.sin(Math.PI * i / (cords - 1)) * 60);
  const pad = width / cords;
  context.lineWidth = 8;

  for (let i = cords - 1; i >= 0; i--) {
    const x = (i + 0.5) * pad;
    const rx = random.range(0, width);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(x, 0);
    const amp = amps[i];
    for (let y = 0; y < height; y += step) {
      const ox = Math.sin(Math.PI * y / height) * (random.noise2D(x + rx, y, freq, amp));
      context.lineTo(x + ox, y);
    }
    context.lineTo(x, height);
    context.lineTo(0, height);
    context.stroke();
    context.fill();
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawCords(context, width, height);
  };
};

canvasSketch(sketch, settings);
