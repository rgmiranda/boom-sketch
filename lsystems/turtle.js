export class Turtle {

  /**
   * @type { CanvasRenderingContext2D }
   */
  #ctx;
  
  /**
   * @type { number }
   */
  #strokeSize
  
  /**
   * @type { number }
   */
  #strokeWeight
  
  /**
   * @type { number }
   */
  #angle

  /**
   * @type { number }
   */
  #scale

  /**
   * @type { number }
   */
  #currentScale = 1

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   * @param { number } strokeSize 
   * @param { number } strokeWeight 
   * @param { number } angle
   * @param { number } scale
   */
  constructor(ctx, strokeSize, strokeWeight, angle, scale) {
    this.#ctx = ctx;
    this.#strokeSize = strokeSize;
    this.#strokeWeight = strokeWeight;
    this.#angle = angle;
    this.#scale = scale;
  }

  /**
   * 
   * @param { string } sentence 
   */
  render(sentence) {
    for (let i = 0; i < sentence.length; i++) {
      const chr = sentence[i];
      switch (chr) {
        case 'F':
        case 'G':
          this.#ctx.beginPath();
          this.#ctx.moveTo(0, 0);
          this.#ctx.lineCap = 'round';
          this.#ctx.lineWidth = this.#strokeWeight * this.#currentScale;
          this.#ctx.lineTo(this.#strokeSize * this.#currentScale, 0);
          this.#ctx.stroke();
          this.#ctx.translate(this.#strokeSize * this.#currentScale, 0);
          break;

        case 'M':
          this.#ctx.translate(this.#strokeSize * this.#currentScale, 0);
          break;

        case 'D':
          this.#currentScale *= this.#scale;
          break;

        case 'U':
          this.#currentScale /= this.#scale;
          break;

        case '+':
          this.#ctx.rotate(this.#angle);
          break;

        case '-':
          this.#ctx.rotate(-this.#angle);
          break;

        case '[':
          this.#ctx.save();
          break;

        case ']':
          this.#ctx.restore();
          break;
      
        default:
          break;
      }
    }
  }

  /**
   * 
   * @param { number } x 
   * @param { number } y 
   * @param { number } angle 
   */
  init(x, y, angle) {
    this.#ctx.resetTransform();
    this.#ctx.translate(x, y);
    this.#ctx.rotate(angle);
    this.#currentScale = 1;
  }

  /**
   * @returns { number }
   */
  get scale() {
    return this.#scale;
  }

  /**
   * @param { number } val
   */
  set scale(val) {
    this.#scale = val;
  }

  /**
   * @returns { number }
   */
  get strokeSize() {
    return this.#strokeSize;
  }

  /**
   * @param { number } val
   */
  set strokeSize(val) {
    this.#strokeSize = val;
  }

  /**
   * @param { number } val
   */
  set strokeWeight(val) {
    this.#strokeWeight = val;
  }

  /**
   * @returns { number }
   */
  get angle() {
    return this.#angle;
  }

  /**
   * @param { number } val
   */
  set angle(val) {
    this.#angle = val;
  }
}