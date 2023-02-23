const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

const cvWidth = cvHeight = 1080;
const radius = cvWidth * 0.16;
const padding = cvWidth * 0.08;
const eyesWidth = cvHeight * 0.015;
const noseWidth = cvWidth * 0.12;
const noseHeight = (cvHeight - padding) * 0.4;
const filtrumWidth = noseWidth * 0.15;
const filtrumHeight = noseHeight * 0.3;
const mouthWidth = (cvWidth - padding) * 0.5;
const mouthHeight = (cvHeight - padding) * 0.1;
const bg = '#F2EECB';
const fg = '#3B3B6D';

const preload = p5 => {
};


const settings = {
  p5: { p5, preload },
  dimensions: [cvWidth, cvHeight],
  //animate: true
};

canvasSketch(({ p5 }) => {
  p5.background(bg);
  return ({ p5, time, width, height }) => {

    /*
     * Base rounded rectangle
     */
    p5.fill(fg);
    p5.noStroke();
    p5.beginShape();

    p5.vertex(padding + radius, padding);
    p5.quadraticVertex(padding, padding, padding, padding + radius);
    p5.vertex(padding, height - radius - padding);
    p5.quadraticVertex(padding, height - padding, padding + radius, height - padding);
    p5.vertex(width - padding - radius, height - padding);
    p5.quadraticVertex(width - padding, height - padding, width - padding, height - radius - padding);
    p5.vertex(width - padding, radius + padding);
    p5.quadraticVertex(width - padding, padding, width - radius - padding, padding);

    p5.endShape(p5.CLOSE);

    /*
     * Face features
     */
    p5.fill(bg);
    p5.rect(padding, padding + radius * 1.5, width - padding, eyesWidth);

    p5.rect((width - noseWidth) * 0.5, padding + radius, noseWidth, noseHeight);
    p5.rect((width - filtrumWidth) * 0.5, padding + radius + noseHeight, filtrumWidth, filtrumHeight);
    p5.rect((width - mouthWidth) * 0.5, padding + radius + noseHeight + filtrumHeight, mouthWidth, mouthHeight);
  };
}, settings);
