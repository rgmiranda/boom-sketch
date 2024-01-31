const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: 'shutter'
};

/*const colors = createColormap({
  colormap: 'portland',
  nshades: numCircles,
});*/
const colors = [
  "#797d62",
  "#9b9b7a",
  "#d9ae94",
  "#e5c59e",
  "#f1dca7",
  "#f8d488",
  "#e4b074",
  "#d08c60",
  "#997b66"
];

class Arc {

  /**
   * 
   * @param { number } radius 
   * @param { string } color
   * @param { number } width 
   */
  constructor (radius, color, width) {
    this.radius = radius;
    this.color = color;
    this.width = width;
    this.init();
  }
  
  init() {
    this.origin = (this.end === undefined) ? random.range(0, Math.PI * 2) : this.end;
    this.size = random.range(Math.PI, Math.PI * 2);
    this.end = this.origin + this.size;
    this.timespan = 90;
    this.age = 0;
  }

  update() {
    if (this.age >= this.timespan) {
      this.init();
    }
    this.age++;
  }
  
  /**
   * 
   * @param { CanvasRenderingContext2D } context 
  */
 draw(context) {
    const currentSize = this.size * Math.sin((this.age / this.timespan) * Math.PI);
    context.beginPath();
    if (this.age < this.timespan * 0.5) {
      context.arc(0, 0, this.radius, this.origin, this.origin + currentSize);
    } else {
      context.arc(0, 0, this.radius, this.end - currentSize, this.end);
    }
    context.strokeStyle = this.color;
    context.lineWidth = this.width;
    context.lineCap = 'round'
    context.stroke();
  }
}

const sketch = ({ width }) => {
  const minRadius = width * 0.2;
  const maxRadius = width * 0.48;
  const lineWidth = (maxRadius - minRadius) / colors.length;
  const arcs = colors.map((c, i) => new Arc(minRadius + i * lineWidth, c, lineWidth));
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.5);
    arcs.forEach(arc => {
      arc.update();
      arc.draw(context);
    })
  };
};

canvasSketch(sketch, settings);
