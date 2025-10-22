const { Vector } = require('@rgsoft/math');
const { tessellate } = require('@rgsoft/voronoi');
const canvasSketch = require('canvas-sketch');
const { math, color } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'tessellate',
};

const colors = createColormap({
  colormap: 'bone',
  nshades: 32,
})


const sketch = async ({width, height}) => {
  const pad = 10;
  const rectBox = [
    new Vector(0, 0),
    new Vector(width, 0),
    new Vector(width, height),
    new Vector(0, height),
  ];
  const sites = Array(256).fill(0)
    .map(() => new Vector(pad + Math.random() * (width - 2 * pad), pad + Math.random() * (height - 2 * pad)));
  const tessellation = tessellate(sites, {
    rectBox,
    excludeRectVertex: false,
  })
  return (
    /**
     * 
     * @param { { context: CanvasRenderingContext2D } } param0 
     */
    ({ context }) => {
      context.lineWidth = 2;
      tessellation.forEach(p => {
        const colorIndex = Math.round(math.mapRange(p.site.x + p.site.y, 0, width + height, 0, colors.length - 1, true));
        const baseColor = colors[colorIndex];
        const h = Math.random() * 50 - 25;
        const s = Math.random() * 10 - 5;
        const l = Math.random() * 20 - 10;
        const newColor = color.offsetHSL(baseColor, h, s, l);

        context.beginPath();
        context.fillStyle = newColor.hex;
        p.vertex.forEach((v, i) => i === 0 ? context.moveTo(v.x, v.y) : context.lineTo(v.x, v.y));
        context.fill();
        context.stroke();
      });
    }
  );
};

canvasSketch(sketch, settings);
