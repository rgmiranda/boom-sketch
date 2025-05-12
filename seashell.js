const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'seashell'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawShell = (context, width, height) => {
  const phi = (1 + Math.sqrt(5)) * 0.5;
  const ratio = phi * phi * phi * phi;

  let radius = 4;
  let pad = 1;
  context.lineCap = 'round';

  context.save();
  context.translate(width * 0.65, height * 0.65);
  while (radius < width * 0.65) {
    const perimeter = 2 * Math.PI * radius
    const angles = perimeter / pad;
    const angle = 2 * Math.PI / angles;
    const inradius = radius / ratio;

    const cpx1 = inradius + (radius - inradius) * 0.25;
    const cpy1 = -20 * (radius - inradius) / pad;
    const cpx2 = inradius + (radius - inradius) * 0.5;
    const cpy2 = 17 * (radius - inradius) / pad;
    const cpy3 = 20 * (radius - inradius) / pad;
    const cpy4 = -17 * (radius - inradius) / pad;

    context.beginPath();
    context.moveTo(inradius, 0);
    context.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, radius, 0);
    context.bezierCurveTo(cpx2, cpy3, cpx1, cpy4, inradius, 0);
    //context.quadraticCurveTo(inradius + (radius - inradius) * 0.01, -3 * pad, radius, 0);
    //context.quadraticCurveTo(inradius + (radius - inradius) * 0.01, -2.4 * pad, inradius, 0);
    context.closePath();
    context.fill();
    context.rotate(angle);
    radius *= Math.pow(ratio, 1/angles);
    pad += 1;
  }
  context.restore();
  
  context.save();
  context.translate(width * 0.65, height * 0.65);
  radius = 4;
  pad = 1;
  context.beginPath();
  context.lineWidth = 2;
  context.moveTo(radius, 0);
  while (radius < width * 0.65) {
    const perimeter = 2 * Math.PI * radius
    const angles = perimeter / pad;
    const angle = 2 * Math.PI / angles;
    context.lineTo(radius, 0);
    context.rotate(angle);
    radius *= Math.pow(ratio, 1/angles);
    pad += 1;
  }
  context.stroke();
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'white';
    context.strokeStyle = 'white';
    drawShell(context, width, height);
  };
};

canvasSketch(sketch, settings);
