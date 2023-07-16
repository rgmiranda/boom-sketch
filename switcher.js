const canvasSketch = require('canvas-sketch');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: `wiphala-${Date.now()}`
};
const colors = [
  '#ffffff',
  '#078930',
  '#0f47af',
  '#742c64',
  '#da121a',
  '#eb7711',
  '#fcdd09',
];

const numRows = 7;
const numCols = 7;

class Row {
  /**
   * 
   * @param { number } cvWidth 
   * @param { number } cvHeight 
   * @param { number } rowHeight 
   * @param { number } pos 
   * @param { number } cols 
   */
  constructor(cvWidth, cvHeight, rowHeight, pos, cols) {
    this.cvWidth = cvWidth;
    this.cvHeight = cvHeight;
    this.rowHeight = rowHeight;
    this.pos = pos;
    this.cols = cols;
    this.offset = pos;
    this.colsWidth = this.cvWidth / cols;
    this.switchTime = Math.random() * 4;
    this.switchPastTime = 0;
    this.switchPercentage = 0;
    this.isSwitching = false;
    this.nextOffset = 0;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    let x, y;
    y = this.rowHeight * this.pos;
    for (let i = 0; i < this.cols; i++) {
      x = this.colsWidth * ((i + this.offset + this.nextOffset * this.switchPercentage) % this.cols);
      context.fillStyle = colors[i];
      context.fillRect(x, y, this.colsWidth, this.rowHeight);
    }

    if (this.isSwitching) {
      x = 0;
      context.fillStyle = colors[this.cols - (this.offset + this.nextOffset) % this.cols];
      context.fillRect(x, y, this.colsWidth * this.switchPercentage, this.rowHeight);

    }
  }

  /**
   * 
   * @param { number } deltaTime 
   * @param { number } frame 
   */
  update(deltaTime, frame) {
    this.switchPastTime += deltaTime;
    if (this.switchPastTime > this.switchTime) {
      if (this.isSwitching) {
        this.offset += this.nextOffset;
        this.nextOffset = 0;
        this.switchTime = Math.random() * 3 + 1;
      } else {
        this.nextOffset = Math.random() < 0.5 ? 1 : 1;
        this.switchTime = Math.random() + 0.1;
      }
      this.switchPastTime = 0;
      this.isSwitching = !this.isSwitching;
    }
    this.switchPercentage = eases.quadInOut(this.switchPastTime / this.switchTime);
  }
}

const sketch = ({ width, height }) => {
  const rows = []
  for (let i = 0; i < numRows; i++) {
    rows.push(new Row(width, height, height / numRows, i, numCols));
  }
  return ({ context, frame, deltaTime }) => {
    rows.forEach(e => {
      e.update(deltaTime, frame);
      e.draw(context);
    });
  };
};

canvasSketch(sketch, settings);
