export class Vector {
    #mag = 0;
    #x = 0;
    #y = 0;
    #angle = 0;

    /**
     * 
     * @param { number } x 
     * @param { number } y 
     */
    constructor(x, y) {
        if (arguments.length !== 2) {
            throw Error('Two parameteres are required');
        }
        this.#x = parseFloat(x);
        this.#y = parseFloat(y);
        this.#setValues();
    }

    static fromAngle(angle) {
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        return new Vector(x, y);
    }

    #setValues() {
        this.#mag = Math.sqrt(this.#x * this.#x + this.#y * this.#y);
        if (this.#mag > 0) {
            this.#angle = Math.abs(Math.asin(this.#x / this.#mag));
        } else {
            this.#angle = 0;
        }
    }

    get mag() {
        return this.#mag;
    }

    get angle() {
        return this.#angle;
    }

    get x() {
        return this.#x;
    }

    set x(value) {
        this.#x = parseFloat(value);
        this.#setValues();
    }

    get y() {
        return this.#y;
    }

    set y(value) {
        this.#y = parseFloat(value);
        this.#setValues();
    }

    normalize() {
        if (this.#mag = 0) {
            return;
        }
        this.#x /= this.#mag;
        this.#y /= this.#mag;
        this.#setValues();
    }

    /**
     * 
     * @param { number} num 
     */
    mult(num) {
        this.#x *= parseFloat(num);
        this.#y *= parseFloat(num);
        this.#setValues();
    }

    /**
     * 
     * @param { Vector } vector 
     */
    add(vector) {
        this.#x += vector.#x;
        this.#y += vector.#y;
    }

    /**
     * 
     * @param { Vector } vector 
     */
    sub(vector) {
        this.#x -= vector.#x;
        this.#y -= vector.#y;
    }

    /**
     * 
     * @param { Vector } vector 
     * @returns { number }
     */
    dist(vector) {
        const dx = this.#x - vector.#x;
        const dy = this.#y - vector.#y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * @returns { Vector }
     */
    copy() {
        return new Vector(this.#x, this.#y);
    }
}