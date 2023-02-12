const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { Vector } = require('../calc');

const cvWidth = 400;
const cvHeight = 400;
const particleCount = 3000;
const particleSize = 1;
const dampRatio = 0.1;
/** @type { Particle[] } */
const particles = [];
const imageBrightness = [];
let image;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.pos = new Vector(Math.floor(Math.random() * canvasWidth), 0);
    this.brightness = 0;
    this.velocity = new Vector(Math.random() * 2 - 1, 5);
  }
  
  update() {
    const adjustedVelocity = this.velocity.copy();
    this.brightness = imageBrightness[Math.floor(this.pos.y) * this.canvasWidth + Math.floor(this.pos.x)];
    adjustedVelocity.mult(mapRange(this.brightness, 0, 255, 1, dampRatio));
    this.pos.add(adjustedVelocity);
    if (this.pos.y > this.canvasHeight) {
      this.pos.y = 0;
      this.pos.x = Math.floor(Math.random() * this.canvasWidth);
    }
  }

  /**
   * @param { CanvasRenderingContext2D } context
   */
  draw(context) {
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, particleSize, 0, Math.PI * 2);
    const c = mapRange(this.brightness, 0, 255, 30, 255);
    context.fillStyle = `rgb(${c}, ${c}, ${c})`;
    context.fill();
  }
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
async function getImageBrightness(width, height) {
  let r, g, b;
  const cv = document.createElement('canvas');
  cv.width = width;
  cv.height = height;
  const ctx = cv.getContext('2d');
  image = await loadImage('images/chess.jpg');
  ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    r = imageData.data[i + 0];
    g = imageData.data[i + 1];
    b = imageData.data[i + 2];
    brightness = 0.38 * r + 0.27 * g + 0.35 * b;
    imageBrightness.push(0.38 * r +  0.27 * g + 0.35 * b );
  }
}

function createParticles(width, height) {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(width, height));
  }
}

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 */
function visualize(context) {
  for (const p of particles) {
    p.update();
    p.draw(context);
  }
}

const sketch = async ({ width, height }) => {
  await getImageBrightness(width, height);
  createParticles(width, height);
  return ({ context, width, height }) => {
    context.globalAlpha = 0.1;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.globalAlpha = 1;
    visualize(context);
  };
};

canvasSketch(sketch, settings);
