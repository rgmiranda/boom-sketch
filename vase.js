const canvasSketch = require('canvas-sketch');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'vase'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } vdiameter 
 * @param { number } hdiameter 
 * @param { number } circles 
 * @param { boolean } inward 
 */
const drawPart = (context, vdiameter, hdiameter, circles, inward = false) => {
  const yr = vdiameter * 0.5;
  let p, xr, xhr;
  for (let i = 0; i < circles; i++) {
    p = eases.quadOut(Math.abs(i - circles * 0.5) / (circles * 0.5));
    xr = p * vdiameter * 0.5;
    xhr = (1 - p) * hdiameter * 0.5 - hdiameter * 0.5;
    context.beginPath();
    if ( i < circles * 0.5) {
      if (inward) {
        context.ellipse(xhr, 0, xr, yr, 0, -Math.PI * 0.5, Math.PI * 0.5);
      } else {
        context.ellipse(xhr, 0, xr, yr, 0, Math.PI * 0.5, Math.PI * 1.5);
      }
    } else {
      xhr *= -1;
      if (inward) {
        context.ellipse(xhr, 0, xr, yr, 0, Math.PI * 0.5, Math.PI * 1.5);
      } else {
        context.ellipse(xhr, 0, xr, yr, 0, -Math.PI * 0.5, Math.PI * 0.5);
      }
    }
    context.stroke();
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    /** @type { {w: number, h: number}[] } */
    const parts = [
      {
        w: 780,
        h: 80
      },
      {
        w: 780,
        h: 100
      },
      {
        w: 780,
        h: 250
      },
      {
        w: 780,
        h: 25
      },
      {
        w: 780,
        h: 40
      },
      {
        w: 780,
        h: 300
      },
      {
        w: 780,
        h: 285
      },
    ]
    const circles = 63;
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.fillRect(0, 0, width, height);
    context.save();
    context.translate(width * 0.5, 0);
    let inward = false;
    for (const { w, h } of parts) {
      context.translate(0, h * 0.5);
      drawPart(context, h, w, circles, inward);
      context.translate(0, h * 0.5);
      inward = !inward;
    }
    //drawPart(context, vradius, hradius, circles, false);
    
  };
};

canvasSketch(sketch, settings);
