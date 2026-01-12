const canvasSketch = require('canvas-sketch');
const { loadImage, getImageData, getImageBrightness } = require('./images');
const { random } = require('canvas-sketch-util');
const { mapRange } = require('canvas-sketch-util/math');

const settings = {
  dimensions: [1080, 1080],
  name: 'dot-machine'
};
const imageFile = 'girl-3.jpg';
const pixelSize = 8;
const fgColor = 'white';
const bgColor = 'black';

const sketch = async ({ width, height }) => {
  const image = await loadImage(`images/${imageFile}`);
  const cols = Math.floor(width / pixelSize);
  const rows = Math.floor(height / pixelSize);
  const imageBrightness = getImageBrightness(image, rows, cols);

  const chars = [
    ['111111111'],
    ['111101111'],
    ['111010111', '110111011', '101111101', '011111110'],
    ['111000111', '110101011', '101101101', '011101110'],
    ['111000111', '110101011', '101101101', '011101110'],
    ['110010011', '101010101', '011010110', '010111010', '001111100'],
    ['110000011', '101000101', '011000110', '010101010', '001101100'],
    ['100010001', '010010010', '001010100', '000111000'],
    ['100000001', '010000010', '001000100', '000101000'],
    ['000010000'],
    ['000000000'],
  ].reverse();

  return (
    /**
     * @param {{ context: CanvasRenderingContext2D, width: number, height: number }} 
     */
    ({ context }) => {
      context.fillStyle = bgColor;
      context.fillRect(0, 0, width, height);
      context.fillStyle = fgColor;
      context.strokeStyle = fgColor;
      for (let i = 0; i < rows; i++) {
        const y = i * pixelSize;
        for (let j = 0; j < cols; j++) {
          const x = j * pixelSize;
          const b = imageBrightness[i * cols + j];
          const charIdx = Math.round(mapRange(b, 0, 255, 0, chars.length - 1));
          /** @type { string } */
          const char = random.pick(chars[charIdx]);
          char.split('').forEach((bit, k) => {
            if (bit === '0') {
              return;
            }
            const sx = (k % 3) * pixelSize / 3;
            const sy = Math.floor(k / 3) * pixelSize / 3;
            context.beginPath();
            context.rect(x + sx, y + sy, pixelSize / 3, pixelSize / 3)
            context.fill();
            //context.stroke();
          })
        }
      }
    });
};

canvasSketch(sketch, settings);
