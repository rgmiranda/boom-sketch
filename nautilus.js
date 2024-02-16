const canvasSketch = require('canvas-sketch');
const { math } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'nautilus'
};

const phi = (1 + Math.sqrt(5)) * 0.5;
const angleCount = 32;
const angle = 2 * Math.PI / angleCount;
const ratio = (4 * (phi - 1) / angleCount) + 1;

const sketch = ({ width }) => {
  const minRadius = 2;
  const maxRadius = width * 4;
  return ({ context, width, height }) => {
    let radius = minRadius;
    const nshades = Math.ceil((Math.log(maxRadius) - Math.log(radius)) / Math.log(ratio));
    const colors = createColormap({
      colormap: 'cubehelix',
      nshades
    }).reverse();
    let cidx = 0;

    context.strokeStyle = 'white';
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    context.translate(width * 0.5, height * 0.7);
    
    while ( radius < maxRadius) {
      context.strokeStyle = colors[cidx];
      context.beginPath();
      context.arc(0, -radius * phi * 0.7615, radius, 0, 2 * Math.PI);
      context.lineWidth = math.mapRange(cidx, 0, nshades - 1, 1, 3, true);
      context.fill();
      context.stroke();

      context.rotate(angle);
      radius *= ratio;
      cidx++;
    }

  };
};

canvasSketch(sketch, settings);
