import { color } from "canvas-sketch-util";

export class Molecule {

  constructor() {
    this.fillColor = this.getColor();
    this.strokeColor = color.offsetHSL(this.fillColor, 0, 0, -50);
  }

  /**
   * @param { Molecule } mol
   * @returns {number}
   */
  getAssociationFactor(mol) {
    throw new Error('Unimplemented method: Molecule::getAssociationFactor');
  }

  /**
   * @returns {number}
   */
  getDissociationFactor() {
    throw new Error('Unimplemented method: Molecule::getDissociationFactor');
  }

  /**
   * @returns {number}
   */
  getSizeRatio() {
    throw new Error('Unimplemented method: Molecule::getSizeRatio');
  }

  /**
   * @returns {number}
   */
  getColor() {
    throw new Error('Unimplemented method: Molecule::getSizeRatio');
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   * @param { number } x
   * @param { number } y
   * @param { number } size
   */
  draw(context, x, y, size) {
    context.save();
    context.translate(x, y);
    context.beginPath();
    context.arc(0, 0, size * this.getSizeRatio(), 0, Math.PI * 2);
    context.strokeStyle = this.strokeColor;
    context.fillStyle = this.fillColor;
    context.fill();
    context.stroke();
    context.restore();
  }
}
