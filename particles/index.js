const canvasSketch = require('canvas-sketch');
const { Particle, Hexagon } = require('./particle');
const colormap = require('colormap');
const { quadIn } = require('eases');

const cvWidth = 1080;
const cvHeight = 1080;
const circleCount = 15;
const dotRadius = 20;
const dotPadding = 0;
const colors = colormap({
  colormap: 'winter',
  nshades: circleCount,
  format: 'hex',
  alpha: 1
});
let mouseDown = false;
const ParticleClass = Hexagon;
const easing = t => 1 - quadIn(t);

let mouseX, mouseY;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};

/**
 * 
 * @param { CanvasRenderingContext2D } context
 */
function visualize(context) {
  for (const p of particles) {
    if (mouseDown && mouseX !== undefined && mouseY !== undefined) {
      p.repel(mouseX, mouseY);
    }
    p.attract();
    p.update();
  }
  particles.sort((a, b) => a.scale - b.scale);
  for (const p of particles) {
    p.draw(context);
  }
}

/**
 * 
 * @param { HTMLCanvasElement } canvas
 */
function addListeners(canvas) {
  const onMouseMove = (ev) => {
    mouseX = (ev.offsetX / canvas.offsetWidth) * canvas.width;
    mouseY = (ev.offsetY / canvas.offsetHeight) * canvas.height;
  };

  const onMouseDown = (ev) => {
    mouseDown = true;
    onMouseMove(ev);
  };

  const onMouseUp = () => {
    mouseDown = false;
  };

  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
}

/** @type { Particle[] } */
const particles = [];

function createParticles(width, height) {
  let particleCount, phi, angleSize;
  const mx = width * 0.5;
  const my = height * 0.5;
  const initAngleOffset = Math.PI / 3;
  for (let i = 0; i < circleCount; i++) {
    if (i === 0) {
      particles.push(new ParticleClass({
        x: mx,
        y: my,
        radius: easing(i / circleCount) * dotRadius,
        color: colors[i]
      }));
    } else {
      particleCount = Math.floor(2 * i * Math.PI);
      angleSize = 2 * Math.PI / particleCount;
      phi = initAngleOffset * i;
      for (let j = 0; j < particleCount; j++) {
        particles.push(new ParticleClass({
          x: mx + Math.cos(phi) * 2 * i * (dotRadius + dotPadding),
          y: my + Math.sin(phi) * 2 * i * (dotRadius + dotPadding),
          radius: easing(i / circleCount) * dotRadius,
          color: colors[i]
        }));
        phi += angleSize;
      }
    }
  }
}

const sketch = ({canvas, width, height }) => {
  createParticles(width, height);
  addListeners(canvas);
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    visualize(context);
  };
};

canvasSketch(sketch, settings);
