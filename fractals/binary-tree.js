const canvasSketch = require('canvas-sketch');
const { Vector } = require('../calc');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `binary-tree-${Date.now()}`
};

const trunkSize = 300;
const trunkWidth = 20;

class Branch {
  /**
   * 
   * @param { number } size 
   * @param { number } angle 
   * @param { number } width
   */
  constructor(size, angle, width) {
    this.size = size;
    this.angle = angle;
    this.width = width;
  }
}

const treeDepth = 8;
const branchRatio = 0.65;
let mouseX = 0, mouseY = 0;
let overBranch, selectedBranch;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { Branch[] } branches 
 * @param { number } width 
 * @param { number } height 
 */
const drawTree = (context, branches, width, height) => {

  context.beginPath();
  context.moveTo(width * 0.5, height);
  context.lineTo(width * 0.5, height - trunkSize);
  context.lineWidth = trunkWidth;
  context.lineCap = 'round';
  context.stroke();

  drawBranches(context, branches, Math.PI, width * 0.5, height - trunkSize, 0);
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { Branch[] } branches 
 * @param { number } angleAcc 
 * @param { number } offsetX 
 * @param { number } offsetY 
 * @param { number } depth 
 * @returns 
 */
const drawBranches = (context, branches, angleAcc, offsetX, offsetY, depth) => {

  if (depth >= treeDepth) {
    return;
  }
  if (depth === 0) {
    overBranch = undefined;
  }
  for (let i = 0; i < branches.length; i++) {
    const b = branches[i];
    const size = b.size * (branchRatio ** depth);
    const dir = Vector.fromAngle(angleAcc + b.angle);
    const x = offsetX + dir.x * size;
    const y = offsetY + dir.y * size;
    
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    context.lineTo(x, y);
    context.lineWidth = b.width * (branchRatio ** depth);
    context.stroke();
    drawBranches(context, branches, angleAcc + b.angle - Math.PI * 0.5, x, y, depth + 1);
    
    if (depth === 0) {
      context.beginPath();
      context.arc(x, y, b.width, 0, Math.PI * 2);
      let dmx = mouseX - x;
      let dmy = mouseY - y;
      
      if (dmx * dmx + dmy * dmy <= 100) {
        context.fillStyle = '#f00';
        overBranch = b;
      } else {
        context.fillStyle = '#000';
      }
      context.fill();
      context.lineWidth = 2;
      context.stroke();
    }
    
  }
};

/**
 * 
 * @param { HTMLCanvasElement } canvas
 */
function addListeners(canvas) {
  const onMouseMove = (ev) => {
    const cvRect = canvas.getBoundingClientRect();
    mouseX = canvas.width * (ev.offsetX) / cvRect.width;
    mouseY = canvas.height * (ev.offsetY) / cvRect.height;

    if (selectedBranch === undefined) {
      return;
    }

    const dx = mouseX - canvas.width * 0.5;
    const dy = mouseY - (canvas.height - trunkSize);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan(dy / dx) + ((dx > 0) ? Math.PI : 0);

    
    selectedBranch.angle = angle;
    selectedBranch.size = dist;
  };

  const onMouseDown = (ev) => {
    if (overBranch !== undefined) {
      selectedBranch = overBranch;
    }
  };

  const onMouseUp = () => {
    selectedBranch = undefined;
  };

  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
}

const sketch = ({ canvas }) => {
  const branches = [
    new Branch(300, Math.PI * 0.375, trunkWidth * branchRatio),
    new Branch(200, Math.PI * 0.625, trunkWidth * branchRatio)
  ];
  addListeners(canvas);
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    drawTree(context, branches, width, height);
  };
};

canvasSketch(sketch, settings);
