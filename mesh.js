const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'mesh',
  animate: true,
};

const size = 1080 / 20;
const freq = 0.019;
const amp = size* 0.45;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } frame 
 * @returns { Array }
 */
const createMesh = (width, height) => {
  const ysize = Math.sqrt(3) * 0.5 * size;
  const rows = height / ysize;
  const cols = width / size;
  let offset = true;
  const mesh = [];
  for (let i = -1; i < rows + 1; i++) {
    const y = i * ysize;
    const meshRow = [];
    for (let j = -1; j < cols + 1; j++) {
      x = j * size + (offset ? 0 : size * 0.5)
      meshRow.push({x, y});
    }
    mesh.push(meshRow);
    offset = !offset;
  }
  return mesh;
};

/**
 * 
 * @param { Array } mesh 
 * @param { number } frame 
 * @param { number } width 
 * @param { number } height 
 */
const offsetMesh = (mesh, frame, width, height) => {
  const cx = -width * 0.25;
  const cy = height * 0.3;

  const omesh = [];

  for (let i = 0; i < mesh.length; i++) {
    const row = [];
    for (let j = 0; j < mesh[i].length; j++) {
      const {x , y} = mesh[i][j];
      const dx = x - cx;
      const dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const o = Math.sin((d - frame * 8) * freq) * amp;
      row.push({
        x: x + o * dx / d,
        y: y + o * dy / d
      });
    }
    omesh.push(row);
  }
  return omesh;
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { Array } mesh 
 */
const drawMesh = (context, mesh) => {
  let offset = true;
  for (let i = 0; i < mesh.length; i++) {
    for (let j = 0; j < mesh[i].length; j++) {
      const { x, y } = mesh[i][j];
      if ( i < mesh.length - 1) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(mesh[i + 1][j].x, mesh[i + 1][j].y);
        context.strokeStyle = 'lightgreen';
        context.stroke();

        if (j < mesh[i].length - 1 && !offset) {
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(mesh[i + 1][j + 1].x, mesh[i + 1][j + 1].y);
          context.strokeStyle = 'lightgreen';
          context.stroke();
        }

        if (j > 0 && offset) {
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(mesh[i + 1][j - 1].x, mesh[i + 1][j - 1].y);
          context.strokeStyle = 'lightgreen';
          context.stroke();
        }
      }
      if ( j < mesh[i].length - 1) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(mesh[i][j + 1].x, mesh[i][j + 1].y);
        context.strokeStyle = 'lightgreen';
        context.stroke();
      }
    }
    offset = !offset;
  }
};

const sketch = ({ width, height }) => {
  const mesh = createMesh(width, height);
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    const omesh = offsetMesh(mesh, frame, width, height);
    drawMesh(context, omesh);
  };
};

canvasSketch(sketch, settings);
