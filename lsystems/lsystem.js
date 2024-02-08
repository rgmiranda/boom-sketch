import { Alphabet } from "./alphabet";

export class LSystem {
  /**
   * 
   * @param { string } axiom 
   * @param { Alphabet } alphabet 
   */
  constructor (axiom, alphabet) {
    this.sentence = axiom;
    this.rules = alphabet.generationRules;
    this.chars = alphabet.chars;
  }

  generate() {
    let nextGen = '';
    this.sentence.split('').forEach(c => {
      const n = this.rules[c] || c;
      nextGen = nextGen.concat(n);
    });
    this.sentence = nextGen;
  }
}