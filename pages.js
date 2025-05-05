const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'pages'
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } pages 
 * @param { number } pageWidth 
*/
const drawPages = (context, width, height, pages, pageWidth) => {
  const cpyPad = height / pages;
  context.strokeStyle = 'black';
  context.lineWidth = pageWidth;

  for (let i = 0; i < pages; i++) {
    let mx, my;
    const p0 = { x: 0, y: height - ( i + 0.5 ) * pageWidth };
    const p1 = { x: width * 0.15 - i * 20, y: height - ( i + 0.5 ) * pageWidth };
    const p2 = { x: width * 0.5, y: height - (i + 0.5) * cpyPad };
    const p3 = { x: width * 0.85 + i * 20, y: height - ( i + 0.5 ) * pageWidth };
    const p4 = { x: width, y: height - ( i + 0.5 ) * pageWidth };
    mx = (p1.x + p2.x) * 0.5;
    my = (p1.y + p2.y) * 0.5;
    context.beginPath();
    context.moveTo(p0.x, p0.y);
    context.quadraticCurveTo(p1.x, p1.y, mx, my);
    mx = (p2.x + p3.x) * 0.5;
    my = (p2.y + p3.y) * 0.5;
    context.quadraticCurveTo(p2.x, p2.y, mx, my);
    context.quadraticCurveTo(p3.x, p3.y, p4.x, p4.y);
    context.stroke();
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawPages(context, width, height, 8, 75);
  };
};

canvasSketch(sketch, settings);
