const canvasSketch = require('canvas-sketch');
const { parse, style } = require('canvas-sketch-util/color');
const { pick } = require('canvas-sketch-util/random');

const cvWidth = cvHeight = 1080;
const firstColor = '#FFF';//pick(risoColors).hex;
const secondColor = '#000';//pick(risoColors).hex;

const numSquares = 10;
const squarePadding = 10;
const squareSize = ((cvWidth - squarePadding) / (numSquares)) - squarePadding;
const squareWidths = Array(numSquares * numSquares).fill().map(() => pick([10, 20, 30]));

const settings = {
  dimensions: [ cvWidth, cvHeight ],
};

let switchPos = cvHeight * 0.5;
let isMouseDown = false;

/**
 * 
 * @param { HTMLCanvasElement } canvas 
 */
function addListeners(canvas) {
  const mouseDown = (ev) => {
    const y = (ev.offsetY / canvas.offsetHeight) * canvas.height;
    isMouseDown = Math.abs(y - switchPos) <= 10;
  }

  const mouseMove = (ev) => {
    const y = (ev.offsetY / canvas.offsetHeight) * canvas.height;
    if (isMouseDown) {
      switchPos = y;
    } else if(Math.abs(y - switchPos) <= 10) {
      canvas.style.cursor = 'ns-resize';
    } else {
      canvas.style.cursor = 'default';
    }
  }

  const mouseUp = () => {
    isMouseDown = false;
  }

  canvas.addEventListener('mousedown', mouseDown);
  canvas.addEventListener('mousemove', mouseMove);
  window.addEventListener('mouseup', mouseUp);
}

const sketch = ({canvas}) => {
  addListeners(canvas);
  return ({ context, width, height }) => {
    let rgb, x, y, lineWidth;
    context.fillStyle = firstColor;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = secondColor;

    for (let i = 0; i < numSquares * numSquares; i++) {
      lineWidth = squareWidths[i];
      x = (i % numSquares) * (squareSize + squarePadding) + squarePadding + lineWidth * 0.5;
      y = Math.floor(i / numSquares) * (squareSize + squarePadding) + squarePadding + lineWidth * 0.5;
      context.beginPath();
      context.rect(x, y, squareSize - lineWidth, squareSize - lineWidth);
      context.lineWidth = lineWidth;
      context.stroke();
    }
    context.beginPath();
    context.arc(width * 0.5, height * 0.5, width * 0.4, 0, Math.PI * 2);
    context.clip();

    rgb = parse(firstColor).rgb.map(val => 255 - val);

    context.fillStyle = style(rgb);
    context.fillRect(0, 0, width, height);

    rgb = parse(secondColor).rgb.map(val => 255 - val);
    context.strokeStyle = style(rgb);

    for (let i = 0; i < numSquares * numSquares; i++) {
      lineWidth = squareWidths[i];
      x = (i % numSquares) * (squareSize + squarePadding) + squarePadding + lineWidth * 0.5;
      y = Math.floor(i / numSquares) * (squareSize + squarePadding) + squarePadding + lineWidth * 0.5;
      context.beginPath();
      context.rect(x, y, squareSize - lineWidth, squareSize - lineWidth);
      context.lineWidth = lineWidth;
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
