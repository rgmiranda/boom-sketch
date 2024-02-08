export class Alphabet {
  /**
   * 
   * @param { string } chars 
   * @param { object } generationRules 
   * @param { object } renderRules 
   */
  constructor(chars, generationRules, renderRules) {
    this.chars = chars.split('');
    this.generationRules = generationRules;
    this.renderRules = renderRules;
  }
}