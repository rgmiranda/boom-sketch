export class Complex {
  #mag;

  /**
   * 
   * @param { number } a 
   * @param { number } b 
   */
  constructor(a, b) {
    this.a = a;
    this.b = b;
    return this;
  }

  /**
   * 
   * @param { number | Complex} n 
   */
  add(n) {
    let { a, b } = this;
    if (typeof n === 'number') {
      a += n;
    } else if (n instanceof Complex) {
      a += n.a;
      b += n.b;
    }
    return new Complex(a, b);
  }

  /**
   * 
   * @param { number | Complex} n 
   */
  sub(n) {
    let { a, b } = this;
    if (typeof n === 'number') {
      a -= n;
    } else if (n instanceof Complex) {
      a -= n.a;
      b -= n.b;
    }
    return new Complex(a, b);
  }
  
  /**
   * 
   * @param { number | Complex} n 
    */
  mult(n) {
    let { a, b } = this;
    if (typeof n === 'number') {
      a *= n;
      b *= n;
    } else if (n instanceof Complex) {
      a = this.a * n.a - this.b * n.b;
      b = this.a * n.b + this.b * n.a;
    }
    return new Complex(a, b);
  }
  
  /**
   * 
   * @param { number | Complex} n 
  */
  div(n) {
    let { a, b } = this;
    
    if (typeof n === 'number') {
      a /= n;
      b /= n;
    } else if (n instanceof Complex) {
      const d = n.a * n.a + n.b * n.b;
      a = (this.a * n.a + this.b * n.b) / d;
      b = (this.b * n.a - this.a * n.b) / d;
    }
    return new Complex(a, b);
  }
  
  /**
   * 
   * @param { number | Complex} n 
  */
  sqrt() {
    let { a, b } = this;
    const m = Math.sqrt(this.mag);
    const phi = Math.atan2(this.b, this.a) * 0.5;
    a = m * Math.cos(phi);
    b = m * Math.sin(phi);
    
    return new Complex(a, b);
  }

  
  
  /**
   * 
   * @returns { number }
  */
 get mag() {
   if (this.#mag === undefined) {
    this.#mag = Math.sqrt(this.a * this.a + this.b * this.b);
   }
    return this.#mag;
  }
}