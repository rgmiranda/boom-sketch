import { doIntersect, getSegmentsIntersectionPoint, getLineFunction, getLineIntersectionPoint, getMediatrix } from "./segments";
import { Vector } from "./vector";

export class Triangle {

  /**
   * @type { Vector }
   */
  #a;

  /**
   * @type { Vector }
   */
  #b;

  /**
   * @type { Vector }
   */
  #c;

  /**
   * @type { Vector }
   */
  #center;

  /**
   * @type { number }
   */
  #radius;

  /**
   * 
   * @param { Vector } a
   * @param { Vector } b
   * @param { Vector } b
   */
  constructor(a, b, c) {
    this.#a = a;
    this.#b = b;
    this.#c = c;
    this.calculateCircle();
  }

  /**
   * @returns { Vector }
   */
  get a() {
    return this.#a;
  }

  /**
   * @returns { Vector }
   */
  get b() {
    return this.#b;
  }

  /**
   * @returns { Vector }
   */
  get c() {
    return this.#c;
  }

  /**
   * @returns { Vector }
   */
  get center() {
    return this.#center;
  }

  /**
   * @returns { number }
   */
  get radius() {
    return this.#radius;
  }

  calculateCircle() {
    const med1 = getMediatrix(this.#a, this.#b);
    const med2 = getMediatrix(this.#b, this.#c);

    if (med1.m === med2.m || (isNaN(med1.m) && isNaN(med2.m))) {
      console.log({x: this.#a.x, y: this.#a.y}, {x: this.#b.x, y: this.#b.y}, {x: this.#c.x, y: this.#c.y}, med1, med2);
      throw new Error('The points are colinear');
    }

    this.#center = getLineIntersectionPoint(med1.m, med1.b, med2.m, med2.b);
    this.#radius = Math.sqrt((this.#a.x - this.#center.x) * (this.#a.x - this.#center.x) + (this.#a.y - this.#center.y) * (this.#a.y - this.#center.y))
  }

  /**
   * 
   * @param { Vector } point
   * @returns { boolean }
   */
  inCircle(point) {
    const d = (point.x - this.#center.x) * (point.x - this.#center.x) + (point.y - this.#center.y) * (point.y - this.#center.y);
    return d < this.#radius * this.#radius;
  }


  /**
   * 
   * @param { Vector } a
   * @param { Vector } b
   * @returns { boolean }
   */
  hasEdge(a, b) {

    if (this.#a.equals(a)) {
      if (this.#b.equals(b) || this.#c.equals(b)) {
        return true
      } else {
        return false;
      }
    } else if (this.#b.equals(a)) {
      if (this.#a.equals(b) || this.#c.equals(b)) {
        return true
      } else {
        return false;
      }
    } else if (this.#c.equals(a)) {
      if (this.#a.equals(b) || this.#b.equals(b)) {
        return true
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * 
   * @param { Vector } v
   * @returns { boolean }
   */
  hasVertex(v) {
    return this.#a.equals(v) || this.#b.equals(v) || this.#c.equals(v);
  }

}