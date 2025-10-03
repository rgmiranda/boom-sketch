const canvasSketch = require('canvas-sketch');
const { loadImage, getImageData, getDataBrightness } = require('./images');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'gattaca'
};

const colors = [
  '#ff6699',
  '#66ff99',
  '#6699ff',
  '#ffff33',
];

const imageFile = 'gattaca.png';
const pixelSize = 15;
const q1 = pixelSize * 0.3;
const q2 = pixelSize * 0.5;
const q3 = pixelSize * 0.7;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number[] } imageBrightness 
 */
const drawPixels = (context, width, height, imageBrightness) => {
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);


  for (let i = 0; i < cols; i++) {
    context.strokeStyle = random.pick(colors);
    const x = i * pixelSize;
      for (let j = 0; j < rows; j++) {
      const y = j * pixelSize;
      const intensity = imageBrightness[j * cols + i] / 255;
      const lineWidth = pixelSize * 0.05 + intensity * pixelSize * 0.15;
      context.lineWidth = lineWidth;
      context.beginPath();
      context.moveTo(x + q1, y);
      context.bezierCurveTo(x + q1, y + q2, x + q3, y + q2, x + q3, y + pixelSize);
      context.stroke();
      context.beginPath();
      context.moveTo(x + q3, y);
      context.bezierCurveTo(x + q3, y + q2, x + q1, y + q2, x + q1, y + pixelSize);
      context.stroke();
    }
  }
};

const sketch = async ({ width, height }) => {
  const image = await loadImage(`images/${imageFile}`);
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);
  const imageData = getImageData(image, cols, rows);
  const imageBrightness = getDataBrightness(imageData);

  return (
    /**
     * @param {{ context: CanvasRenderingContext2D }} 
     */
    ({ context }) => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawPixels(context, width, height, imageBrightness);

  });
};

canvasSketch(sketch, settings);
