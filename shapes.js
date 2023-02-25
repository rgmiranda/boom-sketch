const canvasSketch = require('canvas-sketch');
const risoColors = require('riso-colors');
const p5 = require('p5');
const { offsetHSL } = require('canvas-sketch-util/color');
const { pick } = require('canvas-sketch-util/random');

const cvWidth = cvHeight = 1080;
const maxDist = cvWidth * cvWidth;

const baseSize = 80;

/** @type { string[] } */
const colors = risoColors.map(c => c.hex);

const preload = p5 => {
};

const settings = {
  p5: { p5, preload },
  dimensions: [cvWidth, cvHeight],
  animate: true
};

const patterns = [
  {
    /*
     * (S)quare
     */
    keyCode: 83,
    /**
     * 
     * @param { number } x 
     * @param { number } y
     * @param { any } p5
     * @param { number } amp
     */
    draw(x, y, p5, amp) {
      p5.beginShape();

      p5.vertex(x - baseSize * 0.5 - (Math.random() * 2 - 1) * amp, y - baseSize * 0.5 - (Math.random() * 2 - 1) * amp);
      p5.vertex(x + baseSize * 0.5 + (Math.random() * 2 - 1) * amp, y - baseSize * 0.5 - (Math.random() * 2 - 1) * amp);
      p5.vertex(x + baseSize * 0.5 + (Math.random() * 2 - 1) * amp, y + baseSize * 0.5 + (Math.random() * 2 - 1) * amp);
      p5.vertex(x - baseSize * 0.5 - (Math.random() * 2 - 1) * amp, y + baseSize * 0.5 + (Math.random() * 2 - 1) * amp);

      p5.endShape(p5.CLOSE);
    }
  },
  {
    keyCode: 84, // t
    /**
     * 
     * @param { number } x 
     * @param { number } y
     * @param { any } p5
     * @param { number } amp
     */
    draw(x, y, p5, amp) {
      p5.beginShape();

      p5.vertex(x + baseSize * Math.sin(0) + (Math.random() * 2 - 1) * amp, y - baseSize * Math.cos(0) + (Math.random() * 2 - 1) * amp);
      p5.vertex(x + baseSize * Math.sin(Math.PI * 2 / 3) + (Math.random() * 2 - 1) * amp, y - baseSize * Math.cos(Math.PI * 2 / 3) + (Math.random() * 2 - 1) * amp);
      p5.vertex(x + baseSize * Math.sin(Math.PI * 4 / 3) + (Math.random() * 2 - 1) * amp, y - baseSize * Math.cos(Math.PI * 4 / 3) + (Math.random() * 2 - 1) * amp);

      p5.endShape(p5.CLOSE);
    }
  }
];

let pattern = patterns[0].draw;
let color;

function addListeners(p5) {
  p5.keyPressed = () => {
    const newPattern = patterns.find(p => p.keyCode === p5.keyCode);
    if (newPattern) {
      pattern = newPattern.draw;
    }
  };
}

canvasSketch(({ p5 }) => {
  p5.background('black');
  addListeners(p5);
  // Return a renderer, which is like p5.js 'draw' function
  let cmx, cmy;
  return ({ p5 }) => {
    let dist, dx, dy, amp;
    p5.fill('black');
    p5.strokeWeight(5);
    if (p5.mouseIsPressed) {
      if (cmx === undefined || cmy === undefined) {
        cmx = p5.mouseX;
        cmy = p5.mouseY;
      }
      if (color === undefined) {
        color = pick(colors);
      }
      dx = cmx - p5.mouseX;
      dy = cmy - p5.mouseY;
      dist = dx * dx + dy * dy;
      amp = p5.map(dist, 0, maxDist, 0, baseSize, true);
      p5.stroke(color);
      pattern(p5.mouseX, p5.mouseY, p5, amp);
    } else {
      color = undefined;
      cmx = undefined;
      cmy = undefined;
    }
  };
}, settings);
