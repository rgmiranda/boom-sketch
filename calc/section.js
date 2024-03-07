import { doIntersect, getSegmentsIntersectionPoint } from "./segments";
import { Vector } from "./vector";

export class Section {

  /**
   * @type { Vector[] }
   */
  #polygon = [];

  /**
   * @type { Vector }
   */
  #center;

  /**
   * 
   * @param { Vector } center 
   * @param { Vector[] } polygon 
   */
  constructor(center, polygon) {
    this.#center = center;
    this.#polygon = polygon;
  }

  /**
   * @returns { Vector[] }
   */
  get polygon() {
    return this.#polygon;
  }

  /**
   * @returns { Vector }
   */
  get center() {
    return this.#center;
  }

  /**
   * 
   * @param { Vector } point
   * @returns { boolean }
   */
  contains(point) {
    const rayOrigin = point;
    const rayEnd = point.copy();
    rayEnd.x = -10;
    let intersectCount = 0;
    for (let i = 0; i < this.#polygon.length; i++) {
      const j = (i + 1) % this.#polygon.length;
      if (doIntersect(this.#polygon[j], this.#polygon[i], rayOrigin, rayEnd)) {
        intersectCount++;
      }
    }
    return (intersectCount % 2) !== 0;
  }

  /**
   * 
   * @param { Vector } center 
   * @returns { Section }
   */
  split(center) {
    /**
     * @type { Vector[] }
     */
    const polygon = [...this.#polygon];

    const med = getMediatrix(this.#center, center);

    //console.log(`y = ${med.m} x + ${med.b}`);

    /**
     * @type { { point: Vector, pos: number } }
     */
    const intersections = [];

    for (let i = 0; i < this.#polygon.length; i++) {
      const p = this.#polygon[i];
      const q = this.#polygon[(i + 1) % this.#polygon.length];
      /**
       * @type { Vector }
       */
      let r;
      /**
       * @type { Vector }
       */
      let s;

      if (isNaN(med.m)) {
        r = new Vector(med.b, Math.min(p.y, q.y, center.y));
        s = new Vector(med.b, Math.max(p.y, q.y, center.y));
      } else if (med.m === 0) {
        r = new Vector(Math.min(p.x, q.x, center.x), med.b);
        s = new Vector(Math.max(p.x, q.x, center.x), med.b);
      } else {
        r = new Vector(Math.min(p.x, q.x, center.x), med.m * Math.min(p.x, q.x, center.x) + med.b);
        s = new Vector(Math.max(p.x, q.x, center.x), med.m * Math.max(p.x, q.x, center.x) + med.b);
      }

      if (doIntersect(p, q, r, s)) {
        intersections.push({
          pos: i,
          point: getSegmentsIntersectionPoint(p, q, r, s)
        });
      }
      if (intersections.length === 2) {
        break;
      }
    }

    if (intersections.length !== 2) {
      throw new Error('Error calculating intersection')
    }

    const [ i1, i2 ] = intersections;
    
    this.#polygon.splice(i2.pos, 1, i2.point);
    this.#polygon.splice((i1.pos + 1) % this.#polygon.length, Math.abs(i1.pos - i2.pos) - 1, i1.point);
    
    
    if (!this.contains(this.#center)) {
      [ center, this.#center ] = [ this.#center, center ];
    }
    
    polygon.splice(i1.pos, 1, i1.point);
    const spliced = polygon.splice((i2.pos + 1) % polygon.length, polygon.length - 1 - Math.abs(i1.pos - i2.pos), i2.point);
    if (spliced.length < polygon.length - 1 - Math.abs(i1.pos - i2.pos)) {
      polygon.splice(0, polygon.length - 1 - Math.abs(i1.pos - i2.pos) - spliced.length);
    }

    return new Section(center, polygon);
  }
}