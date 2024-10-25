const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'mushroom-kingdom'
};

const ratio = 0.5;
const colors = createColormap({
  nshades: 7,
  colormap: [
    {
      "index": 0,
      "rgb": [
        112,
        214,
        255
      ],
    },
    {
      "index": 0.25,
      "rgb": [
        255,
        112,
        166
      ],
    },
    {
      "index": 0.5,
      "rgb": [
        255,
        151,
        112
      ],
    },
    {
      "index": 0.75,
      "rgb": [
        255,
        214,
        112
      ],
    },
    {
      "index": 1,
      "rgb": [
        233,
        255,
        112
      ],
    }
  ]
})

const maxDepth = colors.length;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } r
 * @param { number } depth
 */
const drawTree = (context, r, depth) => {
  if (depth >= maxDepth) {
    return;
  }

  context.beginPath();
  context.moveTo(-r, 1.85 * r);
  context.lineTo(-r, r);
  context.arc(0, r, r, Math.PI, Math.PI * 2);
  context.lineTo(r, 1.85 * r);
  context.strokeStyle = colors[depth];
  context.stroke();
  
  context.save();
  context.translate(-r, 1.85 * r);
  context.lineWidth *= ratio;
  drawTree(context, r * ratio, depth + 1);
  context.restore();
  
  context.save();
  context.translate(r, 1.85 * r);
  context.lineWidth *= ratio;
  drawTree(context, r * ratio, depth + 1);
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.save();
    context.lineWidth = (1 / ratio) ** maxDepth;
    context.translate(width * 0.5, height * 0.075);
    drawTree(context, width * 0.25, 0);
    context.restore();
  };
};

canvasSketch(sketch, settings);
