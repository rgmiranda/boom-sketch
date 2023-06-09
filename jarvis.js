const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const createColormap = require('colormap');

const seed = random.getRandomSeed();
random.setSeed(seed);

const cvWidth = 1080,
  cvHeight = 1080,
  bgColor = 'black';

const settings = {
  dimensions: [cvWidth, cvHeight],
  name: `jarvis-${seed}`,
};

const colors = createColormap({
  colormap: 'freesurface-blue',
  nshades: 10,
  format: 'rgbaString',
  alpha: [0, 1]
}).reverse();

const fontFace = new FontFace('orbitron', 'url(../fonts/orbitron.ttf)');

function drawPolygon({ context, radius, sides }) {
  const angle = 2 * Math.PI / sides;
  context.beginPath();
  context.moveTo(cvWidth * 0.5, radius + cvHeight * 0.4);
  for (let i = 1; i < sides; i++) {
    const x = Math.cos(angle * i + Math.PI * 0.5) * radius + cvWidth * 0.5;
    const y = Math.sin(angle * i + Math.PI * 0.5) * radius + cvHeight * 0.4;
    context.lineTo(x, y);
  }
  context.closePath();
}
/**
 * 
 * @param { {
 *   context: CanvasRenderingContext2D,
 *   text: string,
 *   fontStyle: string,
 *   fontFace: number,
 *   width: number,
 *   height: number } } param0 
 */
function drawText({ context, text, fontStyle, fontSize, width, height }) {
  context.font = `${fontSize}px ${fontStyle}`;
  context.fillStyle = '#3492eb';
  context.fillText(text, 0, height, width);
}

const sketch = async () => {
  await fontFace.load();
  document.fonts.add(fontFace);
  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    const radius = width * 0.45;
    const sides = 3;

    context.save();
    context.lineWidth = 15;

    for (let i = 0; i < colors.length; i++) {
      context.strokeStyle = colors[i];
      drawPolygon({
        context,
        radius: radius - 3.5 * context.lineWidth * i,
        sides
      });
      context.stroke();
    }

    context.restore();

    drawText({
      context,
      text: 'JARVIS',
      fontStyle: 'orbitron',
      fontSize: 50,
      width,
      height
    })
  };
};

canvasSketch(sketch, settings);
