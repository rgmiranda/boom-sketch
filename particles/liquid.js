const canvasSketch = require('canvas-sketch');
const { Particle, Square } = require('./particle');

const cvWidth = 600;
const cvHeight = 600;
const pixelSize = 3;
let mouseDown = false;
const ParticleClass = Square;

let mouseX, mouseY;

/** @type { ImageData } */
let imageData;

const settings = {
  dimensions: [cvWidth, cvHeight],
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

/**
 * Load an image from a given URL
 * @param { String } url The URL of the image resource
 * @returns { Promise<Image> } The loaded image
 */
function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}


/**
 * 
 * @param { CanvasRect } context 
 * @param { number } width 
 * @param { number } height 
 */
async function getImageData(width, height) {
  const cv = document.createElement('canvas');
  cv.width = width;
  cv.height = height;
  const ctx = cv.getContext('2d');
  image = await loadImage('images/luke.png');
  ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
  imageData = ctx.getImageData(0, 0, width, height);
}

/** @type { Particle[] } */
const particles = [];

function createParticles(width, height) {
  let x, y, a, r, g, b, idx, color;
  const cols = width / pixelSize;
  const rows = height / pixelSize;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      x = Math.floor(i * pixelSize + pixelSize * 0.5);
      y = Math.floor(j * pixelSize + pixelSize * 0.5);
      idx = (y * width + x) * 4;
      r = imageData.data[idx + 0];
      g = imageData.data[idx + 1];
      b = imageData.data[idx + 2];
      a = imageData.data[idx + 3];
      if (!a) {
        continue;
      }
      color = `rgb(${r}, ${g}, ${b})`;
      particles.push(new ParticleClass({
        x,
        y,
        radius: pixelSize,
        color
      }));
    }
  }
  console.log(particles.length, particles.slice(-1)[0].pos);
}

const sketch = async ({ canvas, width, height }) => {
  await getImageData(width, height);
  createParticles(width, height);
  addListeners(canvas);
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    visualize(context);
  };
};

canvasSketch(sketch, settings);
