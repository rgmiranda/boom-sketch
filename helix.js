const canvasSketch = require('canvas-sketch');

const amp = 2 * Math.PI;
const numSteps = 24;
const numCurves = 6;
const curveStep = amp / numSteps;
const curveOffset = 2 * Math.PI / numCurves;

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'helix',
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } y0 
 * @param { number } y1 
 * @param { number } offset
 * @param { number } amp
 */
const drawCurve = (context, y0, y1, offset, amp) => {
  const yStep = (y1 - y0) / numSteps;
  const xOffset = -Math.sin(offset) * amp;
  let y = y0;
  let x = Math.sin(offset) * amp + xOffset;
  context.beginPath();
  context.moveTo(x, y);
  for (let i = 0; i < numSteps; i++) {
    y += yStep;
    x = Math.sin(offset + (i + 1) * curveStep) * amp + xOffset;
    context.lineTo(x, y);
  }
  context.stroke();
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } y0 
 * @param { number } y1 
 * @param { number } offset
 * @param { number } amp
 */
const drawHelix = (context, y0, y1, offset, amp) => {
  const yStep = (y1 - y0) / numSteps;
  const xOffset = -Math.sin(offset) * amp;
  let y = y0;
  for (let i = 0; i < numSteps; i++) {
    let x = Math.sin(offset + (i + 1) * curveStep) * amp + xOffset;
    y += yStep;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x * 0.5, y);
    context.stroke();
  }
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = '#333333';
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, 0);
    for (let i = 0; i < numCurves; i++) {
      drawCurve(context, 100, height - 100, i * curveOffset - frame * 0.05, width * 0.1);
    }
    for (let i = 0; i < numCurves * 0.5; i++) {
      drawCurve(context, 100, height - 100,  2 * i * curveOffset - frame * 0.05, width * 0.2);
      drawHelix(context, 100, height - 100,  2 * i * curveOffset - frame * 0.05, width * 0.2)
    }

  };
};

canvasSketch(sketch, settings);
