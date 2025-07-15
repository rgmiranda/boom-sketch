const { Vector } = require('@rgsoft/math');
const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'blend'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { string[] } colors 
 */
const drawDegrade = (context, width, height, colors) => {
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  const r = 0.6;
  const c = new Vector(width * 0.5, height * 0.5);
  const points = [
    new Vector(0, 0),
    new Vector(width, 0),
    new Vector(width, height),
    new Vector(0, height),
  ];
  for (let i = 0; i < colors.length; i++) {
    const diffs = points.map((p, j, a) => Vector.sub(a[(j + 1) % a.length], p).mult(r));
    const mainColor = colors[i];
    const altColor = colors[colors.length - i - 1];

    points.forEach((p, j, a) => {
      const np = a[(j + 1) % a.length];
      const d = diffs[j];
      const nd = diffs[(j + 1) % a.length];
      const color = (j % 2) === 0 ? mainColor : altColor;
      context.beginPath();
      context.moveTo(p.x + d.x, p.y + d.y);
      context.lineTo(np.x, np.y);
      context.lineTo(np.x + nd.x, np.y + nd.y);
      context.closePath();
      context.fillStyle = color;
      context.strokeStyle = color;
      context.fill();
      context.stroke();
    });

    points.forEach((p, j) => p.add(diffs[j]));
  }
};

const sketch = () => {
  const colors = createColormap({
    nshades: 16,
    colormap: 'bone'
  })
  return ({ context, width, height }) => {
    drawDegrade(context, width, height, colors);
  };
};

canvasSketch(sketch, settings);
