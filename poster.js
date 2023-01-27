const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { shuffle, range, value } = require('canvas-sketch-util/random');
const eases = require('eases');

const cvWidth = 1080;
const cvHeight = 1080;

const fftSize = 512;
const volume = 0.1;
const numCircles = 10;
const numSlices = 1;
const sliceAngle = Math.PI * 2 / numSlices;
const baseRadius = 200;
const baseWidth = 10;
const radiusRatio = 100;
const circles = [];
const bins = shuffle(Array.from(Array(numCircles).keys()));

function createCircles() {
  let prevRadius = baseRadius;
  for (let i = 0; i < numCircles; i++) {
    const t = (i + 1) / numCircles;
    const width = baseWidth + eases.cubicIn(t) * radiusRatio;
    const radius = prevRadius + width * 0.5 + 1;
    const angleOffset = range(Math.PI * -0.25, Math.PI * 0.25) - Math.PI * 0.5;
    const angleSpeed = value() * 0.01;
    circles.push({
      lineWidth: width,
      color: 'black',
      radius,
      angleOffset,
      angleSpeed
    });
    prevRadius = radius + width * 0.5 + 1;
  }
}

function updateCircles() {
  for (let i = 0; i < numCircles; i++) {
    circles[i].angleOffset += circles[i].angleSpeed;
  }
}

/** @type { HTMLAudioElement } */
let audio;

/** @type { AudioContext } */
let audioContext;

/** @type { Uint8Array } */
let audioData;

/** @type { MediaElementAudioSourceNode } */
let sourceNode;

/** @type { AnalyserNode } */
let analyserNode;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};

function addListeners () {
  window.addEventListener('click', () => {
    if (!audioContext) {
      createAudio();
    }

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });
}

function createAudio() {
  audio = document.createElement('audio');
  audio.src = 'audio/rise.mp3';
  audio.volume = volume;
  
  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  sourceNode.connect(analyserNode);

  analyserNode.fftSize = fftSize;
  audioData = new Uint8Array(analyserNode.frequencyBinCount);
}

/**
 * 
 * @param { Uint8Array } audioData
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
function visualize(audioData, context, width, height) {

  let lineWidth, color, radius, mapped, bin, phi;

  context.save();
  context.translate(width * 0.5, height * 0.5);
  context.scale(1, -1);

  for (let i = 0; i < numCircles; i++) {
    context.save();
    for (let j = 0; j < numSlices; j++) {
      context.rotate(sliceAngle);
      ({ lineWidth, color, radius, angleOffset } = circles[i]);
      
      bin = bins[i * numSlices + j];

      mapped = mapRange(audioData[bin], 0, 255, 0, 1, true);
      phi = sliceAngle * mapped;

      context.beginPath();
      context.lineWidth = lineWidth;
      context.strokeStyle = color;
      context.arc(0, 0, radius, angleOffset , phi + angleOffset);
      context.stroke();

    }
    context.restore();
  }

  context.restore();
}

const sketch = () => {
  createCircles();
  addListeners();
  return ({ context, width, height, frame }) => {

    context.fillStyle = '#EEEAE0';
    context.fillRect(0, 0, width, height);

    if (!audioContext) {
      return;
    }

    analyserNode.getByteFrequencyData(audioData);
    visualize(audioData, context, width, height);
    updateCircles();
  };
};

canvasSketch(sketch, settings);
