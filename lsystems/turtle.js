import { Alphabet } from "./alphabet";

export class Turtle {

  /**
   * 
   * @param { CanvasRenderingContext2D } ctx 
   * @param { number } width 
   * @param { number } height 
   * @param { Alphabet } alphabet 
   */
  constructor(ctx, width, height, alphabet) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.chars = alphabet.chars;
    this.rules = alphabet.renderRules;
  }

  render(sentence) {
    sentence.split('').forEach((c) => {
      const rule = this.rules[c];
      if ( typeof rule !== 'function' ) {
        return;
      }
      rule(this.ctx);
    });
  }
}