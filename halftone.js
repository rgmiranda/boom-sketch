const canvasSketch = require('canvas-sketch');
const { loadImage, getImageData } = require('./images');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'halftone'
};

const imageFile = 'nimbus.png';
const pixelSize = 5;

/**
 * 
 * @param { Uint8ClampedArray } rgba 
 */
function validateRgba(rgba) {
  if (!(rgba instanceof Uint8ClampedArray)) {
    throw new Error("RGBA must be an array");
  }

  if (rgba.length % 4 !== 0) {
    throw new Error("Invalid number of elements in array");
  }

  for (const c of rgba) {
    if (c < 0 || c > 255) {
      throw new Error("Every channel in RGBA must be between 0 and 255");
    }
  }
}


/**
 * 
 * @param { Uint8ClampedArray } pixels 
 * @returns { Uint8ClampedArray }
 */
function halftone(pixels) {
  validateRgba(pixels);
  const cmykData = new Uint8ClampedArray(pixels.length);
  for (let i = 0; i < pixels.length; i += 4) {
    const [r, g, b, a] = pixels.slice(i, i + 4);
    const nr = r / 255;
    const ng = g / 255;
    const nb = b / 255;

    const k = 1 - Math.max(nr, ng, nb);

    if (k === 1) {
      cmykData[i + 0] = 0;
      cmykData[i + 1] = 0;
      cmykData[i + 2] = 0;
      cmykData[i + 3] = 1;
    }
    
    const c = (1 - nr - k) / (1 - k);
    const m = (1 - ng - k) / (1 - k);
    const y = (1 - nb - k) / (1 - k);

    cmykData[i + 0] = c;
    cmykData[i + 1] = m;
    cmykData[i + 2] = y;
    cmykData[i + 3] = k;
  }
  return cmykData;
}

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { Uint8ClampedArray } cmykData 
 * @param { number } width 
 * @param { number } height 
 * @param { number } cellSize 
 */
function drawHalftone( ctx, cmykData, width, height, cellSize) {
  const channels = ['k', 'c', 'm', 'y'];
  const angles = { c: 15, m: 75, y: 0, k: 45 };
  const colors = {
    c: 'cyan',
    m: 'magenta',
    y: 'yellow',
    k: 'black'
  };

  for (const ch of channels) {
    const chIndex = { c: 0, m: 1, y: 2, k: 3 }[ch];
    const angle = angles[ch];
    const color = colors[ch];

    ctx.save();
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((angle * Math.PI) / 180);
    const matrix = ctx.getTransform();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    for (let gy = -centerY * Math.SQRT2; gy < centerY * Math.SQRT2; gy += cellSize) {
      for (let gx = -centerX * Math.SQRT2; gx < centerX * Math.SQRT2; gx += cellSize) {

        const point = new DOMPoint(gx, gy);
        const pTransformed = matrix.transformPoint(point);
        
        const ox = Math.round(pTransformed.x);
        const oy = Math.round(pTransformed.y);
        
        const intensity = sampleChannelAverage(
          cmykData,
          chIndex,
          ox,
          oy,
          width,
          height,
          cellSize
        );

        const radius = cellSize * intensity * 0.5;
        ctx.beginPath();
        ctx.arc(gx + cellSize * 0.5, gy + cellSize * 0.5, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

/**
 * 
 * @param { Uint8ClampedArray } cmykData 
 * @param { number } channelIndex 
 * @param { number } startX 
 * @param { number } startY 
 * @param { number } width 
 * @param { number } height 
 * @param { number } cellSize 
 * @returns 
 */
function sampleChannelAverage( cmykData, channelIndex, startX, startY, width, height, cellSize) {
  let total = 0;
  let count = 0;
  for (let y = 0; y < cellSize; y++) {
    for (let x = 0; x < cellSize; x++) {
      const py = startY + y;
      const px = startX + x;
      if (px >= 0 && px < width && py >= 0 && py < height) {
        const idx = (py * width + px) * 4 + channelIndex;
        total += cmykData[idx];
        count++;
      }
    }
  }
  return count > 0 ? total / count : 0;
}

const sketch = async ({ width, height }) => {
  const image = await loadImage(`images/${imageFile}`);
  const imageData = getImageData(image, width, height);
  const cmykData = halftone(imageData.data);

  return (
    /**
     * @param {{ context: CanvasRenderingContext2D, width: number, height: number }} 
     */
    ({ context }) => {
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'multiply';

    drawHalftone(context, cmykData, width, height, pixelSize);

    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
  });
};

canvasSketch(sketch, settings);
