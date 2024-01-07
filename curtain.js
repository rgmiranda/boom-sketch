const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
require('canvas-sketch-util/random');
const { loadImage, getImageBrightness } = require('./images');
const { random } = require('canvas-sketch-util');
const createColormap = require('colormap');
const seed = random.getRandomSeed();

const cvWidth = cvHeight = 1080;

const name = `doodle-${seed}`;

const bg = 'black';
const lineColor = createColormap({
  colormap: 'copper',
  nshades: 24
});
const imageFile = 'skull-800.jpg';

const settings = {
  dimensions: [cvWidth, cvHeight],
  name,
  animate: true,
  fps: 24,
};

class Stroker {

  /**
   * 
   * @param { number } width 
   * @param { number } height 
   * @param { HTMLImageElement } image
   * @param { Uint8ClampedArray } imageBrightness
   */
  constructor(width, height, image, imageBrightness) {
    this.age = random.rangeFloor(0, 1000);
    this.px = random.range(0, width);
    this.py = 0;
    this.x = this.px;
    this.y = this.py;
    this.width = width;
    this.height = height;
    this.imageBrightness = imageBrightness;
    this.image = image;
    this.change = false;
    this.lineWidth = 1;
    this.lineColor = 'black';
  }

  update() {
    if (isNaN(this.x) || isNaN(this.y) || isNaN(this.px) || isNaN(this.py)) {
      sketchManager.pause();
      console.log("DEATH", this);
    }
    const ix = Math.floor(mapRange(this.px, 0, this.width, 0, this.image.width, true));
    const iy = Math.floor(mapRange(this.py, 0, this.height, 0, this.image.height - 1, true));
    const idx = iy * this.image.width + ix;
    const brightness = this.imageBrightness[idx];
    const noiseFreq = mapRange(brightness, 0, 255, 0.0001, 0.002, true);
    const speed = mapRange(brightness, 0, 255, 5, 2, true);
    this.lineWidth = mapRange(brightness, 0, 255, 0.5, 2, true);
    this.lineColor = lineColor[Math.floor(mapRange(brightness, 0, 255, 10, lineColor.length, true))];
    const angle = random.noise3D(this.px, this.py, this.age, noiseFreq, Math.PI * 0.05) + Math.PI * 0.5;
    const dx = Math.cos(angle) * speed
    const dy = Math.sin(angle) * speed;

    this.px = this.x;
    this.py = this.y;
    this.x += dx;
    this.y += dy;

    if (this.px < 0 && this.x < 0) {
      this.x = this.px = this.width;
    } else if (this.px > this.width && this.x > this.width) {
      this.x = this.px = 0;
    }
/*
    if (this.py < 0 && this.y < 0) {
      this.py = this.y = this.height;
    } else if (this.py > this.height && this.y > this.height) {
      this.py = this.y = 0;
      this.px = this.x = random.range(0, this.width);
    }*/

    this.age++;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw (context) {
    context.beginPath();
    context.moveTo(this.px, this.py);
    context.lineTo(this.x, this.y);
    context.strokeStyle = this.lineColor;
    context.lineWidth = this.lineWidth;
    context.stroke();
  };
}


const addListeners = () => {
  window.addEventListener('click', () => {
    if (!sketchManager) {
      return;
    }
    if (sketchManager.props.playing) {
      sketchManager.pause();
    } else {
      sketchManager.play();
    }
  });
}

const sketch = async ({ width, height, context }) => {
  addListeners();
  const image = await loadImage(`images/${imageFile}`);
  const imageBrightness = getImageBrightness(image);
  const strokers = Array(256).fill(false).map(() => new Stroker(width, height, image, imageBrightness));
  context.fillStyle = bg;
  context.fillRect(0, 0, width, height);
  return ({ context }) => {
    strokers.forEach(s => {
      s.update();
      s.draw(context);
    });
  };
};

canvasSketch(sketch, settings).then(manager => {
  sketchManager = manager;
  sketchManager.pause();
});
