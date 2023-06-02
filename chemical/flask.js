import { Molecule } from "./molecule";
import random from "canvas-sketch-util/random";
import { TubulinDimmer } from "./dimmer";
import { TubulinMonomer } from "./monomer";

const directions = ['w', 'e', 'n', 's'];

export class Flask {
  /**
   * 
   * @param { number } width 
   * @param { number } height 
   * @param { number } rows 
   * @param { number } cols 
   */
  constructor (width, height, cols, rows) {
    this.width = width;
    this.height = height;
    this.cols = cols;
    this.rows = rows;
    this.sw = width / cols;
    this.sh = height / rows;
    /** @type { { molecules: Molecule[], directions: string[] }[] } */
    this.positions = Array(cols *  rows).fill().map( () => ({ molecules: [], directions: [] }));
    this.transitionTime = 3;
    this.reactionTime = 3;
    this.isReacting = true;
    this.elapsedTime = 0;
  }

  addDimmer() {
    const molecule = new TubulinDimmer(random.rangeFloor(0, this.cols), random.rangeFloor(0, this.rows), Math.min(this.sw, this.sh));
    const idx = random.rangeFloor(0, this.rows) * this.cols + random.rangeFloor(0, this.cols);
    this.positions[idx].molecules.push(molecule);
  }

  addMonomer() {
    const molecule = new TubulinMonomer(random.rangeFloor(0, this.cols), random.rangeFloor(0, this.rows), Math.min(this.sw, this.sh));
    const idx = random.rangeFloor(0, this.rows) * this.cols + random.rangeFloor(0, this.cols);
    this.positions[idx].molecules.push(molecule);
  }

  react() {
    this.isReacting = true;
  }

  transition() {
    this.isReacting = false;
    this.positions.forEach((pos) => {
      pos.directions = Array(pos.molecules.length).fill(false).map(() => random.pick(directions));
    });
  }

  /**
   * 
   * @param { number } deltaTime 
   */
  update(deltaTime) {
    this.elapsedTime += deltaTime;
    if (this.isReacting) {
      if (this.elapsedTime >= this.reactionTime) {
        this.transition();
        this.elapsedTime = 0;
      }
    } else {
      if (this.elapsedTime >= this.transitionTime) {
        this.react();
        this.elapsedTime = 0;
      }
    }
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    for (let i = 0; i <= this.cols; i++) {
      context.beginPath();
      context.moveTo(i * this.sw, 0);
      context.lineTo(i * this.sw, this.height);
      context.stroke();
    }
    for (let i = 0; i <= this.rows; i++) {
      context.beginPath();
      context.moveTo(0, i * this.sh);
      context.lineTo(this.width, i * this.sh);
      context.stroke();
    }
    if (this.isReacting) {
      this.positions.forEach((pos, idx) => {
        pos.molecules.forEach(mol => {
          const x = ((idx % this.cols) + 0.5) * this.sw;
          const y = (Math.floor(idx / this.cols) + 0.5) * this.sh;
          mol.draw(context, x, y, Math.min(this.sw, this.sh));
        })
      });
    } else {
      this.positions.forEach((pos, idx) => {
        pos.molecules.forEach(mol => {
          const porc = this.elapsedTime / this.transitionTime;
          const i = (idx % this.cols);
          const j = Math.floor(idx / this.cols);
          const ox = (i + 0.5) * this.sw;
          const oy = (j + 0.5) * this.sh;
          mol.draw(context, x, y, Math.min(this.sw, this.sh));
        })
      });
    }
  }
}
