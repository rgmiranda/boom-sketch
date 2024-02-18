const canvasSketch = require('canvas-sketch');
const { Turtle } = require('./turtle');
const { random, math, color } = require('canvas-sketch-util');
const { LSystem } = require('./lsystem');
const createColormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'forest-'.concat(Date.now())
};

const colors = createColormap({
  nshades: 48,
  colormap: 'magma',
});

const sketch = ({ context, height }) => {

  const turtle = new Turtle(context, 0, 0, 0);
  const treeSystem = new LSystem('F', [
    'F => FD[++F-F+F][-F-FF]U'
  ]);
  treeSystem.generate(4);

  const ground = height * 0.9;
  /**
   * @type { CanvasGradient }
   */
  const gradient = context.createLinearGradient(0, 0, 0, ground);
  colors.forEach((c, i, arr) => gradient.addColorStop(i / (arr.length - 1), c));

  return ({ context, width, height }) => {
    /**
     * @type { LSystem }
     */
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, ground);
    context.fillStyle = 'black';
    context.fillRect(0, ground, width, height - ground);

    context.beginPath();
    context.arc(width * Math.random(), height * 0.5 * Math.random(), 30, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();

    for (let i = 0; i < 24; i++) {
      turtle.angle = Math.random() * Math.PI * 0.05 + Math.PI * 0.05;
      turtle.scale = Math.random()  * 0.2 + 0.5;
      turtle.strokeSize = width * (Math.random() * 0.1 + 0.05);
      turtle.strokeWeight = math.mapRange(turtle.strokeSize, width * 0.05, width * 0.15, 4, 8);
      turtle.init(width * Math.random(), ground, -Math.PI * (0.42 + Math.random() * 0.16));
      turtle.render(treeSystem.sentence);
    }

  };
};

canvasSketch(sketch, settings);
