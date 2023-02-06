import { noise1D } from 'canvas-sketch-util/random';
import { loadImage } from '../images';

const noiseFreq = 0.01;
const noiseAmp = 3;
let noiseIdx = 1;

export class StormBackground {
  constructor (width, height, imageUrl) {
    loadImage(imageUrl).then((image) => this.image = image);
    this.width = width;
    this.height = height;
    this.xOffset = 0;
    this.yOffset = 0;
    this.ySpeed = -6;
    this.xSpeed = -3
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    if (!this.image) {
      return;
    }
    let x, y, imgWidth, imgHeight;
    imgWidth = this.image.width;
    imgHeight = this.image.height;

    x = -(imgWidth - (Math.abs(this.xOffset) % imgWidth));
    while (x < this.width) {
      y = -(imgHeight - (Math.abs(this.yOffset) % imgHeight));
      while (y < this.height) {
        context.drawImage(this.image, x, y);
        y += imgHeight;
      }
      x += imgWidth;
    }
  }

  update() {
    this.yOffset += this.ySpeed;
    this.xOffset += this.xSpeed;
    this.xSpeed = noise1D(noiseIdx, noiseFreq, noiseAmp) - 3;
    noiseIdx++;
    console.log(this.xSpeed);
  }
}
