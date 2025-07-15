const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const nshades = 8;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `night-day-${nshades}`
};


/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawDayNight = (context, width, height) => {
  /** @type { HTMLCanvasElement } */
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  /** @type { CanvasRenderingContext2D } */
  const ctx = canvas.getContext('2d');

  const cx = width * 0.5;
  const cy = height * 0.5;
  const r = width * 0.4;

  const dayColors = createColormap({
    nshades: nshades + 2,
    colormap: 'hot'
  }).slice(2);

  const nightColors = createColormap({
    nshades,
    colormap: [
      {
        index: 0,
        rgb: [0, 0, 128]
      },
      {
        index: 0.3,
        rgb: [32, 0, 240]
      },
      {
        index: 1,
        rgb: [255, 255, 255]
      },
    ]
  });

  const vpad = height * 0.5 / nshades;
  const rpad = 0.5 * r / nshades;
  dayColors.forEach((c, i) => {
    context.fillStyle = c;
    context.fillRect(0, (nshades - i - 1) * vpad, width, vpad);
    context.fillStyle = nightColors[i];
    context.fillRect(0, cy + i * vpad, width, vpad);
  });
  dayColors.forEach((c, i) => {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'overlay';
    
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.25, 2 * rpad * (nshades - i), 0.5 * Math.PI, 1.5 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = nightColors[i];
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.25, 2 * rpad * (nshades - i), 0.5 * Math.PI, 1.5 * Math.PI);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = nightColors[i];
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.25, 2 * rpad * (nshades - i), -0.5 * Math.PI, 0.5 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.25, 2 * rpad * (nshades - i), -0.5 * Math.PI, 0.5 * Math.PI);
    ctx.closePath();
    ctx.fill();

    context.drawImage(canvas, 0, 0);
  });
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawDayNight(context, width, height);
  };
};

canvasSketch(sketch, settings);
