const canvasSketch = require('canvas-sketch');
const { noise3D, noise1D } = require('canvas-sketch-util/random');
const { Vector } = require('p5');

const cvWidth = cvHeight = 500;
let mouseDown = false;

const noiseFreq = 0.0025;
const wormSize = 100;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};

/**
 * 
 * @param { HTMLCanvasElement } canvas
 */
function addListeners(canvas) {
  const onMouseMove = (ev) => {
    mouseX = (ev.offsetX / canvas.offsetWidth) * canvas.width;
    mouseY = (ev.offsetY / canvas.offsetHeight) * canvas.height;
  };

  const onMouseDown = (ev) => {
    mouseDown = true;
    onMouseMove(ev);
  };

  const onMouseUp = () => {
    mouseDown = false;
  };

  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
}

const wormHead = new Vector(0, 0);
const wormDisplay = new Vector(0, 0);
let velocity;

const sketch = ({ context, width, height }) => {
  //addListeners(canvas);
  context.fillStyle = 'black';
  wormHead.x = width * 0.5;
  wormHead.y = height * 0.5;
  context.fillRect(0, 0, width, height);
  return ({ context, frame, width, height }) => {
    context.beginPath();
    context.arc(wormDisplay.x, wormDisplay.y, wormSize, 0, Math.PI * 2);
    context.strokeStyle = 'white';
    context.lineWidth = 4;
    context.fill();
    context.stroke();
    velocity = Vector.fromAngle(noise3D(wormHead.x, wormHead.y, frame, noiseFreq, Math.PI) + Math.PI);
    velocity.mult(Math.floor(noise1D(frame, noiseFreq, 5)) + 10);
    wormHead.add(velocity);
    wormDisplay.add(velocity);

    if (wormDisplay.x - wormSize > width) {
      wormDisplay.x = - wormSize;
    } else if (wormDisplay.x + wormSize < 0) {
      wormDisplay.x = width + wormSize;
    }

    if (wormDisplay.y - wormSize > height) {
      wormDisplay.y = - wormSize;
    } else if (wormDisplay.y + wormSize < 0) {
      wormDisplay.y = height + wormSize;
    }
  };
};

canvasSketch(sketch, settings);
