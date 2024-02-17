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
     * @param { string } char 
     * @param { string } next 
     */
    constructor(char, next) {
        this.#char = char;
        this.#next = next;
    }

    get char() {
        return this.#char;
    }

    get next() {
        return this.#next;
    }
}