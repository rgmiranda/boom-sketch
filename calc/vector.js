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
    this.#resetValues();
  }

  static fromAngle(angle) {
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return new Vector(x, y);
  }

  #resetValues() {
    this.#mag = undefined;
    this.#angle = undefined;
  }

  get mag() {
    if (this.#mag === undefined) {
      this.#mag = Math.sqrt(this.#x * this.#x + this.#y * this.#y);
    }
    return this.#mag;
  }

  get angle() {
    if (this.#angle === undefined) {
      if (this.mag > 0) {
        this.#angle = Math.atan(this.#y / this.#x);
      } else {
        this.#angle = 0;
      }
    }
    return this.#angle;
  }

  get x() {
    return this.#x;
  }

  set x(value) {
    this.#x = parseFloat(value);
    this.#resetValues();
  }

  get y() {
      return this.#y;
  }

  set y(value) {
    this.#y = parseFloat(value);
    this.#resetValues();
  }

  normalize() {
    if (this.mag === 0) {
      return;
    }
    this.#x /= this.#mag;
    this.#y /= this.#mag;
    this.#resetValues();
  }

  /**
   * 
   * @param { number} num 
   */
  mult(num) {
    this.#x *= parseFloat(num);
    this.#y *= parseFloat(num);
    this.#resetValues();
  }

  /**
   * 
   * @param { Vector } vector 
   */
  add(vector) {
    this.#x += vector.#x;
    this.#y += vector.#y;
    this.#resetValues();
  }

  /**
   * 
   * @param { Vector } vector 
   */
  sub(vector) {
    this.#x -= vector.#x;
    this.#y -= vector.#y;
    this.#resetValues();
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
   * 
   * @param { Vector } vector 
   * @returns { boolean }
   */
  equals(vector) {
    return vector.x === this.#x && vector.y === this.y;
  }

  /**
   * 
   * @param { Vector } vector 
   * @returns { number }
   */
  angleTo(vector) {
    const cp = this.#x * vector.x + this.#y * vector.y;
    return Math.acos(cp / (this.mag * vector.mag));
  }

  /**
   * @returns { Vector }
   */
  copy() {
    return new Vector(this.#x, this.#y);
  }

  transpose() {
    const aux = this.#y;
    this.#y = this.#x;
    this.#x = aux;
    this.#resetValues();
  }

  /**
   * 
   * @param { number } angle 
   * @returns { Vector }
   */
  static fromAngle(angle) {
    const instance = new Vector(Math.cos(angle), Math.sin(angle));
    instance.#angle = angle;
    return instance;
  }
}
