import { Rule } from "./rule";

export class LSystem {

  /**
   * @type { string }
   */
  #axiom;

  /**
   * @type { string }
   */
  #sentence;

  /**
   * @type { Rule[] }
   */
  #rules;

  /**
   * @type { number }
   */
  #generation;

  /**
   * 
   * @param { string } axiom 
   * @param { Rule[] } rules
   */
  constructor (axiom, rules) {
    this.#axiom = axiom;
    this.#rules = rules;
    this.init();
  }

  init() {
    this.#sentence = this.#axiom;
    this.#generation = 0;
  }

  /**
   * 
   * @param { number } n 
   */
  generate(n = 1) {
    let nextGen;

    for (let i = 0; i < n; i++) {
      nextGen = '';
      this.#sentence.split('').forEach(c => {
        const rule = this.#rules.find(r => r.char === c);
        nextGen = nextGen.concat(rule === undefined ? c : rule.next);
      });
      this.#sentence = nextGen;
      this.#generation++;
    }
  }

  /**
   * @returns { string }
   */
  get sentence() {
    return this.#sentence;
  }

  /**
   * @returns { number }
   */
  get generation() {
    return this.#generation;
  }
}