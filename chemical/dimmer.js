import { Molecule } from "./molecule";

/**
 * @extends { Molecule }
 */
export class TubulinDimmer extends Molecule {

  /**
   * @param { Molecule } mol
   * @returns {number}
   */
  getAssociationFactor(mol) {
    return 0;
  }

  /**
   * @returns {number}
   */
  getDissociationFactor() {
    return 0.2;
  }

  /**
   * @returns { number }
   */
  getSizeRatio() {
    return 0.4;
  }

  /**
   * @returns { string }
   */
  getColor() {
    return '#FA9';
  }
}
