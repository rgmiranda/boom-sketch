const canvasSketch = require('canvas-sketch');
const { loadImage } = require('./images');

/** @type { HTMLImageElement } */
let image;

const pixelSize = 60;
const capturePixelSize = 2 * pixelSize;
const imgName = 'girl-2.jpg'

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'bug-vision'
};

const hexagon = [];
let angle = -Math.PI * 0.5;
for (let k = 0; k < 6; k++) {
  hexagon.push({
    x: Math.cos(angle),
    y: Math.sin(angle),
  });
  angle += Math.PI / 3;
}
console.log(hexagon);

const sketch = ({ width, height }) => {
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);

  const wr = image.width / width;
  const hr = image.height / height;

  const dw = pixelSize;
  const dh = pixelSize;
  const sw = capturePixelSize * wr;
  const sh = capturePixelSize * hr;

  return ({ context }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const xr = 1 - (0.5 - Math.sqrt(3) / 4) * 2;
    const yr = 0.75;

    for (let i = -1; i < rows / yr; i++) {
      const dy = i * pixelSize * yr;
      const sy = i * dh * yr * hr - sh * 0.375;
      
      for (let j = (i % 2) === 0 ? 0 : -0.5; j < (cols + 1) / xr; j++) {
        const dx = j * pixelSize * xr;
        const sx = j * dw * xr * wr - sw * 0.375;

        context.save();
        context.beginPath();
        hexagon.forEach(({ x, y }, k) => {
          if (k === 0) {
            context.moveTo(dx + (x + 1) * pixelSize * 0.5, dy + (y + 1) * pixelSize * 0.5);
          } else {
            context.lineTo(dx + (x + 1) * pixelSize * 0.5, dy + (y + 1) * pixelSize * 0.5);
          }
        });
        context.closePath();
        context.clip();
        context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        context.restore();
      }
    }
  };
};

loadImage(`./images/${imgName}`).then((img) => {
  
  image = document.createElement('canvas');
  image.width = 1080;
  image.height = 1080;

  /** @type { CanvasRenderingContext2D } */
  const ctx = image.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 1080, 1080);

  ctx.beginPath();
  ctx.arc(540, 540, 500, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  image = img;
  canvasSketch(sketch, settings);
}).catch(err => console.log('Error loading image:', { error: err.message ?? err }));

