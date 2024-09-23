const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const colormap = 'plasma';
const nshades = 48;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `dripping-${colormap}${nshades}-${Date.now()}`
};

/** @type { string[] } */
const colors = createColormap({
  colormap,
  nshades
});

/**
 * 
 * @param { number } x 
 * @param { number } width 
 * @param { number } height 
 * @param { string } color 
 * @returns { {x: number, y: number, width: number, height: number, color: string}[] }
 */
const generateDrops = (x, width, height, color) => {
  const drops = [];
  let y = -width;
  let dropHeight;
  let minHeight = 150;
  let padHeight = 10;
  while (y < height) {
    dropHeight = random.range(width + minHeight, width + minHeight * 2);
    drops.push({ x, y, width, height: dropHeight, color });
    y += dropHeight + random.range(width, width + padHeight * 2);
    minHeight *= 0.5; 
    padHeight *= 2; 
  }
  return drops;
};

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { {x: number, y: number, width: number, height: number, color: string}[][] } droplets 
 */
const drawDroplets = (ctx, droplets) => {
  droplets.forEach((drops, i) => {
    drops.forEach(({ x, y, width, height, color }) => {
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, width * 0.5);
      ctx.stroke();
      ctx.fill();

      if (i + 1 >= droplets.length) {
        return;
      }

      droplets[i + 1]
      .filter(drop => drop.y + drop.width * 0.5 < y && y < drop.y + drop.height - drop.width * 0.5 )
      .forEach(drop => {
        const uy = Math.max(drop.y + width * 0.5, y - width * 0.5);
        const dy = Math.min(drop.y + drop.height, y + height - width * 0.5);
        const radii =  Math.min(width * 0.5, (y - drop.y - width * 0.5));
        ctx.beginPath();
        ctx.moveTo(x + width * 0.5, y);
        ctx.arcTo(drop.x, y, drop.x, uy, radii)
        ctx.lineTo(drop.x, dy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
      
      droplets[i + 1]
      .filter(drop => (drop.y + drop.width * 0.5) < (y + height) && (y + height) < (drop.y + drop.height - drop.width * 0.5))
      .forEach(drop => {
        const uy = Math.max(drop.y, y - width * 0.5);
        const dy = Math.min(drop.y + drop.height - width * 0.5, y + height + width * 0.5);
        const radii = Math.min(width * 0.5, (drop.y + drop.height) - (y + height) - width * 0.5)
        ctx.beginPath();
        ctx.moveTo(x + width * 0.5, y + height);
        ctx.arcTo(drop.x, y + height, drop.x, dy, radii);
        ctx.lineTo(drop.x, uy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
      
      droplets[i + 1]
      .filter(drop => y + width * 0.5 < drop.y && drop.y < y + height - width * 0.5)
      .forEach(drop => {
        const uy = Math.max(drop.y - width * 0.5, y + width * 0.5);
        const dy = Math.min(drop.y + drop.height - width * 0.5, y + height);
        const radii =  Math.min(width * 0.5, drop.y - y - width * 0.5);
        ctx.beginPath();
        ctx.moveTo(drop.x + width * 0.5, drop.y);
        ctx.arcTo(x + width, drop.y, x + width, uy, radii)
        ctx.lineTo(x + width, dy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
     
     droplets[i + 1]
     .filter(drop => y + width * 0.5 < drop.y + drop.height && drop.y + drop.height < y + height - width * 0.5)
     .forEach(drop => {
        const uy = Math.max(y, drop.y + width * 0.5);
        const dy = Math.min(y + height - width * 0.5, drop.y + drop.height + width * 0.5);
        const radii =  Math.min(width * 0.5, (y + height) - (drop.y + drop.height) - width * 0.5);
        ctx.beginPath();
        ctx.moveTo(drop.x + width * 0.5, drop.y + drop.height);
        ctx.arcTo(x + width, drop.y + drop.height, x + width, dy, radii)
        ctx.lineTo(x + width, uy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
      
    });
  });
};

const sketch = ({ width, height }) => {

  const droplets = [];
  const dw = width / colors.length;
  colors.forEach((color, i) => droplets.push(generateDrops(i * dw, dw, height, color)));

  return ({ context }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawDroplets(context, droplets);
  };
};

canvasSketch(sketch, settings);
