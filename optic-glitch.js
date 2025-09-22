const canvasSketch = require('canvas-sketch');
const { loadImage } = require('./images');
require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'negro'
};

const sketch = async ({ width, height }) => {
  const offset = 75;
  const image = await loadImage('images/fontanarrosa.jpg');
  const rxOffset = offset; //random.rangeFloor(-offset, offset);
  const ryOffset = offset; //random.rangeFloor(-offset, offset);
  const gxOffset = 0; //random.rangeFloor(-offset, offset);
  const gyOffset = 0; //random.rangeFloor(-offset, offset);
  const bxOffset = -offset; //random.rangeFloor(-offset, offset);
  const byOffset = -offset; //random.rangeFloor(-offset, offset);

  const rImage = document.createElement('canvas');
  rImage.width = width;
  rImage.height = height;
  let ctx = rImage.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.drawImage(image, rxOffset, ryOffset, width, height);
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(rxOffset, ryOffset, width, height);

  const gImage = document.createElement('canvas');
  gImage.width = width;
  gImage.height = height;
  ctx = gImage.getContext('2d');
  ctx.fillStyle = 'green';
  ctx.drawImage(image, gxOffset, gyOffset, width, height);
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(gxOffset, gyOffset, width, height);

  const bImage = document.createElement('canvas');
  bImage.width = width;
  bImage.height = height;
  ctx = bImage.getContext('2d');
  ctx.fillStyle = 'blue';
  ctx.drawImage(image, bxOffset, byOffset, width, height);
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(bxOffset, byOffset, width, height);

  return (
    /**
     * 
     * @param { { context: CanvasRenderingContext2D } } param0 
     */
    ({ context }) => {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';
      context.drawImage(rImage, 0, 0);
      context.drawImage(gImage, 0, 0);
      context.drawImage(bImage, 0, 0);
      context.globalCompositeOperation = 'destination-over';
      context.fillStyle = 'black';
      context.fillRect(0, 0, width, height);
    }
  );
};

canvasSketch(sketch, settings);
