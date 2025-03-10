const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'waving',
};

/**
 * @type { { speed: number, amp: number, freq: number, color: string, barWidth: number }[] }
 */
const waves = [
  {
    amp: 200,
    color: '#ade8f4',
    freq: 0.1,
    speed: 0.5,
    barWidth: 0.1
  },
  {
    amp: 200,
    color: '#90e0ef',
    freq: 0.11,
    speed: 0.75,
    barWidth: 0.25
  },
  {
    amp: 200,
    color: '#48cae4',
    freq: 0.12,
    speed: 1,
    barWidth: 0.5
  },
];

const numBars = 32;

const sketch = ({ width, height }) => {
  const barSpan = width / numBars;
  const wavePad = height / (waves.length + 1);
  const cx = width * 0.5;
  const cy = height * 0.5;
  return ({ context, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    let angle = -0.5 * Math.PI;
    const sides = 6;
    const anglePad = 2 * Math.PI / sides;
    const r = width * 0.48;
    context.beginPath();
    /*
    context.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    for (let i = 0; i < sides; i++) {
      angle += anglePad;
      context.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    }
    context.closePath();
    */
    context.arc(cx, cy, width * 0.48, 0, Math.PI * 2);
    context.clip();

    waves.forEach((wave, i) => {
      const { freq, amp, speed, color, barWidth } = wave;
      for (let j = 0; j < numBars; j++) {
        const x = (j + 0.5) * barSpan;
        const y = (i + 1) * wavePad + Math.sin((j - frame * speed) * freq) * amp;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, height);
        context.strokeStyle = color;
        context.lineWidth = barSpan * barWidth;
        context.stroke();
      }
    });

  };
};

canvasSketch(sketch, settings);
