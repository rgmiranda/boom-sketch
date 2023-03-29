import { Vector } from "../calc";
import { noise2D } from 'canvas-sketch-util/random';
import { clamp } from "canvas-sketch-util/math";

export class FlowField {

  generateDirection(x, y) {
    //return noise2D(x, y, this.noiseScale, this.noiseAmp);
    return (Math.cos(x * this.noiseScale) + Math.cos(y * this.noiseScale)) * this.noiseAmp;
  }

  constructor(width, height, rows, cols, noiseScale, noiseAmp) {
    this.rows = rows;
    this.cols = cols;
    this.rectWidth = width / cols;
    this.rectHeigth = height / rows;
    this.width = width;
    this.height = height;
    this.field = [];
    this.noiseScale = noiseScale;
    this.noiseAmp = noiseAmp;
    let angle, x, y;
    for (let i = 0; i < this.rows * this.cols; i++) {
      x = (i % this.cols) * this.rectWidth;
      y = Math.floor(i / this.cols) * this.rectHeigth;
      angle = this.generateDirection(x, y);
      this.field.push(Vector.fromAngle(angle));
    }
  }

  /**
   * 
   * @param { number } x 
   * @param { number } y 
   * @returns { Vector }
   */
  getFlow(x, y) {
    const i = Math.floor(x / this.rectWidth);
    const j = Math.floor(y / this.rectHeigth);
    const idx = clamp(j * this.cols + i, 0, this.field.length - 1);
    return this.field[idx];
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    let x, y, flow;
    for (let i = 0; i < this.field.length; i++) {
      flow = this.field[i];
      context.save();
      context.strokeStyle = 'white';
      x = (i % this.cols) * this.rectWidth;
      y = Math.floor(i / this.cols) * this.rectHeigth;
      context.translate(x + this.rectWidth * 0.5, y + this.rectHeigth * 0.5);
      context.beginPath();
      context.rect(-this.rectWidth * 0.5, - this.rectHeigth * 0.5, this.rectWidth, this.rectHeigth);
      context.stroke();

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(flow.x * this.rectWidth * 0.5, flow.y * this.rectHeigth * 0.5);
      context.stroke();
      context.restore();
    }
  }

}
