const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'serpent-black'
};

/** @type { { circles: number, color: string, outerRadius: number, innerRadius: number }[] } */
const rings = [
  {
    circles: 24,
    color: '#61f4de',
    outerRadius: 68,
    innerRadius: 704
  },
  {
    circles: 24,
    color: '#63dfe4',
    outerRadius: 68,
    innerRadius: 568
  },
  {
    circles: 24,
    color: '#65cbe9',
    outerRadius: 68,
    innerRadius: 432
  },
  {
    circles: 24,
    color: '#68b6ef',
    outerRadius: 64,
    innerRadius: 300
  },
  {
    circles: 32,
    color: '#6aa1f4',
    outerRadius: 64,
    innerRadius: 172
  },
  {
    circles: 32,
    color: '#6c8dfa',
    outerRadius: 54,
    innerRadius: 54
  }
  /*
  {
    circles: 24,
    color: '#006466',
    outerRadius: 68,
    innerRadius: 704
  },
  {
    circles: 24,
    color: '#0b525b',
    outerRadius: 68,
    innerRadius: 568
  },
  {
    circles: 24,
    color: '#144552',
    outerRadius: 68,
    innerRadius: 432
  },
  {
    circles: 24,
    color: '#212f45',
    outerRadius: 64,
    innerRadius: 300
  },
  {
    circles: 32,
    color: '#312244',
    outerRadius: 64,
    innerRadius: 172
  },
  {
    circles: 32,
    color: '#4d194d',
    outerRadius: 54,
    innerRadius: 54
  }
  */
];

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } outerRadius 
 * @param { number } innerRadius 
 * @param { number } circles 
 * @param { string } color
*/
const drawRing = (context, width, height, outerRadius, innerRadius, circles, color) => {
  context.save();
  context.strokeStyle = color;
  const angle = 2 * Math.PI / circles;
  
  context.translate(width * 0.5, height * 0.5);
  for (let i = 0; i < circles; i++) {
    context.beginPath();
    context.arc(0, outerRadius, innerRadius, 0, Math.PI * 2);
    context.stroke();
    context.rotate(angle);
  }

  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    rings.forEach(({ color, innerRadius, outerRadius, circles }) => drawRing(context, width, height, outerRadius, innerRadius, circles, color));
  };
};

canvasSketch(sketch, settings);
