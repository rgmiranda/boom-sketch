import { Molecule } from "./molecule";


export class TubulinMonomer extends Molecule {
  /**
   * @param { Molecule } mol
   * @returns {number}
   */
  getAssociationFactor(mol) {
    if (mol instanceof TubulinMonomer) {
      return 0.4;
    }
    return 0;
  }

  /**
   * @returns {number}
   */
  getDissociationFactor() {
    return 0;
  }

  /**
   * @returns { number }
   */
  getSizeRatio() {
    return 0.25;
  }

  /**
   * @returns { string }
   */
  getColor() {
    return '#9AF';
  }

}
