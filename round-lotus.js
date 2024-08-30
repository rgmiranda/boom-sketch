const canvasSketch = require('canvas-sketch');
const createColormap = require('colormap');
const colormap = 'hsv';
const numCircles = 9;
const initRadius = 25;
const numPetals = 12;
const anglePad = 2 * Math.PI / numPetals;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `round-lotus-${colormap}-${numCircles}-${initRadius}-${numPetals}`,
};

const colors = createColormap({
  colormap,
  nshades: numPetals + 1
});

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { number } radius 
 */
const drawSquares = (ctx, radius) => {
  const diagonalSize = (1.025) * 2 * Math.PI * radius / numPetals;
  ctx.save();
  for (let i = 0; i < numPetals; i++) {
    ctx.beginPath();
    ctx.moveTo(0, radius + diagonalSize * 0.5);
    ctx.arcTo(-diagonalSize * 0.5, radius, 0, radius - diagonalSize * 0.5, diagonalSize * 0.5);
    ctx.lineTo(0, radius - diagonalSize * 0.5);
    ctx.arcTo(diagonalSize * 0.5, radius, 0, radius + diagonalSize * 0.5, diagonalSize * 0.5);
    ctx.lineTo(0, radius + diagonalSize * 0.5);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.rotate(anglePad);
  }
  ctx.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    let radius = initRadius;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, height * 0.5);
    for (let i = 0; i < numCircles; i++) {
      drawSquares(context, radius);
      radius *= Math.SQRT2;
      context.rotate(anglePad * 0.5);
    };
  };
};

canvasSketch(sketch, settings);
