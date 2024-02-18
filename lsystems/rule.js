export class Rule {
    /**
     * @type { string }
     */
    #char;

    /**
     * @type { string }
     */
    #next;

    /**
     * 
     * @param { string } rule
     */
    constructor(rule) {
      const matches = rule.replaceAll(' ', '').match(/^([FGMLDU\[\]\-+])(-|=)>([FGMLDU\[\]\-+]+)$/);
      if (!matches) {
        throw new Error('Unrecognized rule pattern');
      }
      this.#char = matches[1];
      this.#next = matches[3];
    }

    get char() {
        return this.#char;
    }

    get next() {
        return this.#next;
    }
}
