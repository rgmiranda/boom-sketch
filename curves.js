const canvasSketch = require('canvas-sketch');
const cvWidth = 1080,
  cvHeight = 1080;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};

class Point {

  constructor(x, y, isControlable = false) {
    this.x = x;
    this.y = y;
    this.isControlable = isControlable;
    this.radius = 10;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    context.save();

    context.beginPath();
    context.translate(this.x, this.y);
    context.fillStyle = this.isControlable ? 'red' : 'black';
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}

class QuadraticCurve {

  /**
   * 
   * @param  { Point[] } points
   */
  constructor(...points) {
    if (!Array.isArray(points)) {
      throw new TypeError('Array excepted');
    }
    if (points.length === 0) {
      throw new TypeError('Empty array received');
    }
    this.points = points;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {

    
    context.save();
    
    context.beginPath();
    context.lineTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      context.lineTo(this.points[i].x, this.points[i].y);
    }
    context.lineWidth = 1;
    context.strokeStyle = '#999';
    context.stroke();

    context.beginPath();
    for (let i = 0; i < this.points.length - 1; i++) {
      const curr = this.points[i];
      const next = this.points[i + 1];
      
      const mx = (curr.x + next.x) * 0.5;
      const my = (curr.y + next.y) * 0.5;

      if (i === 0) {
        context.moveTo(curr.x, curr.y);
      } else if (i === this.points.length - 2) {
        context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
      } else {
        context.quadraticCurveTo(curr.x, curr.y, mx, my);
      }
            
    }
    context.strokeStyle = 'blue';
    context.lineWidth = 4;
    context.stroke();

    context.restore();

    for (const point of this.points) {
      point.draw(context);
    }
  }

  /**
   * 
   * @param { MouseEvent } ev
   * @param { HTMLCanvasElement } canvas
   */
  onMouseDown(ev, canvas) {
    const x = (ev.offsetX / canvas.offsetWidth) * canvas.width;
    const y = (ev.offsetY / canvas.offsetHeight) * canvas.height;
    let dist;
    let isDragging = false;

    for (const point of this.points) {
      dist = Math.sqrt((point.x - x) * (point.x - x) + (point.y - y) * (point.y - y))
      point.isDragging = (dist < point.radius);
      isDragging |= point.isDragging;
    }
    if (!isDragging) {
      this.points.push(new Point(x, y));
    }
  }

  /**
   * 
   * @param { MouseEvent } ev
   * @param { HTMLCanvasElement } canvas
   */
  onMouseMove(ev, canvas) {
    const x = (ev.offsetX / canvas.offsetWidth) * canvas.width;
    const y = (ev.offsetY / canvas.offsetHeight) * canvas.height;
    for (const point of this.points) {
      if (!point.isDragging) {
        continue;
      }
      point.x = x;
      point.y = y;
    }
  }

  onMouseUp() {
    for (const point of this.points) {
      point.isDragging = false;
    }
  }
}

const sketch = ({ canvas }) => {

  const curve = new QuadraticCurve(
    new Point(100, cvHeight * 0.5),
    new Point(200, cvHeight - 300),
    new Point(cvWidth * 0.5, cvHeight * 0.65),
    new Point(cvWidth - 200, 250),
    new Point(cvWidth - 100, cvHeight * 0.75),
  );
  canvas.addEventListener('mousedown', (ev)  => { 
    if (!curve.onMouseDown(ev, canvas)) {

    }
  });
  window.addEventListener('mouseup', (ev)  => { 
    curve.onMouseUp();
  });
  canvas.addEventListener('mousemove', (ev)  => { 
    curve.onMouseMove(ev, canvas);
  });

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    curve.draw(context);
  };
};

canvasSketch(sketch, settings);
