const canvasSketch = require('canvas-sketch');

const numPixels = 41;
const pad = 200;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'rgb-pegs-black'
};
const colors = [
  'magenta',
  'yellow',
  'turquoise',
  ]
/*
const colors = [
  'red',
  'green',
  'blue',
]
*/

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { string } color 
 * @param { number } angle 
 */
const drawPegs = (context, width, height, color, angle) => {
  const pw = (width - pad * 2) / numPixels;
  const ph = (height - pad * 2) / numPixels;

  context.save();

  context.globalCompositeOperation = 'lighten';
  
  context.fillStyle = color;
  context.translate(width * 0.5, height * 0.5);
  context.rotate(angle);
  
  for (let i = 0; i < numPixels; i++) {
    const y = i * ph - height * 0.5 + pad;
    for (let j = 0; j < numPixels; j++) {
      const x = j * pw - width * 0.5 + pad;
      context.beginPath();
      context.ellipse(x, y, pw * 0.25, ph * 0.25, 0, 0, Math.PI * 2);
      context.fill();
    }
  }

  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    const angle = 0.5 * Math.PI / colors.length;
    colors.forEach((color, i) => {
      drawPegs(context, width, height, color, i * angle);
    });
    
    context.fillStyle = 'black';
    context.globalCompositeOperation = 'destination-over';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
