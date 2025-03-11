const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'fidelity',
};

const from = 250;
const to = 950;
const tracks = 256;
const trackWidth = (to - from) / tracks;

const sketch = () => {
  return ({ context, width, height }) => {
    const cx = width * 0.5;
    const cy = height;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(cx, cy);
    
    /** @type { CanvasGradient } */
    let grad = context.createConicGradient(0, 0, 0);
    let centerStop = 0.75;
    let stopRad = 0.1;
    let r = to + 20;
    grad.addColorStop(0, '#000000');
    grad.addColorStop(centerStop - stopRad, '#000000');
    grad.addColorStop(centerStop, '#FFFFFF');
    grad.addColorStop(centerStop + stopRad, '#000000');
    grad.addColorStop(1, '#000000');

    context.strokeStyle = grad;
    context.beginPath();
    context.arc(0, 0, r, Math.PI, 2 * Math.PI);
    context.stroke();
    
    context.lineWidth = trackWidth * 0.8;
    for (let i = 0; i < tracks; i++) {
      grad = context.createConicGradient(0, 0, 0);
      centerStop = random.range(0.725, 0.775);
      stopRad = random.range(0.05, 0.07);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(centerStop - stopRad, '#000000');
      grad.addColorStop(centerStop, '#FFFFFF');
      grad.addColorStop(centerStop + stopRad, '#000000');
      grad.addColorStop(1, '#000000');
      r = to - i * trackWidth;
      context.strokeStyle = grad;
      context.beginPath();
      context.arc(0, 0, r, Math.PI, 2 * Math.PI);
      context.stroke();

      if (((i + 1) % 32) === 0) {
        i += 5;
      }
    }

    grad = context.createConicGradient(0, 0, 0);
    centerStop = 0.75;
    stopRad = 0.12;
    grad.addColorStop(0, '#000000');
    grad.addColorStop(centerStop - stopRad, '#000000');
    grad.addColorStop(centerStop, '#FFFFFF');
    grad.addColorStop(centerStop + stopRad, '#000000');
    grad.addColorStop(1, '#000000');
    r = from - 15;
    context.strokeStyle = grad;
    context.beginPath();
    context.arc(0, 0, r, Math.PI, 2 * Math.PI);
    context.stroke();
  };
};

canvasSketch(sketch, settings);
