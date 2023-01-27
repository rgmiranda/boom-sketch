const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { rangeFloor, boolean } = require('canvas-sketch-util/random');
const colormap = require('colormap');
const eases = require('eases');

const cvWidth = 1080;
const cvHeight = 1080;

const fftSize = 64;
const volume = 0.1;
const numCircles = 5;
const numSlices = 9;
const sliceAngle = Math.PI * 2 / numSlices;
const baseRadius = 200;
const radiusRatio = 300;
const circles = [];
const bins = [];
const circleColors = colormap({
  colormap: 'magma',
  nshades: 9,
  format: 'hex',
  alpha: 1
});

let prevRadius = baseRadius;
for (let i = 0; i < numCircles; i++) {
  const t = (i + 1) / numCircles;
  const width = eases.quadIn(t) * radiusRatio;
  const radius = prevRadius + width * 0.5;
  circles.push({
    lineWidth: width,
    color: circleColors[i],
    radius
  });
  for (let j = 0; j < numSlices; j++) {
    if (boolean()) {
      bins.push(rangeFloor(0, fftSize * 0.25));
    } else {
      bins.push(-1);
    }
  }
  prevRadius = radius;
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

  let lineWidth, color, radius, mapped, bin;

  context.save();
  context.translate(width * 0.5, height * 0.5);

  for (let i = 0; i < numCircles; i++) {
    context.save();
    for (let j = 0; j < numSlices; j++) {
      context.rotate(sliceAngle);

      bin = bins[i * numCircles + j];
      if (bin === -1) {
        continue;
      }

      ({ lineWidth, color, radius } = circles[i]);
      mapped = mapRange(audioData[bin], 0, 255, 0, 1, true);
      lineWidth *= mapped;
      if (lineWidth < 1) {
        continue;
      }

      context.beginPath();
      context.lineWidth = lineWidth;
      context.strokeStyle = color;
      context.arc(0, 0, radius, 0 , sliceAngle);
      context.stroke();

    }
    context.restore();
  }

  context.restore();
}

const sketch = () => {
  addListeners();
  return ({ context, width, height, frame }) => {

    context.fillStyle = '#EEEAE0';
    context.fillRect(0, 0, width, height);

    if (!audioContext) {
      return;
    }

    analyserNode.getByteFrequencyData(audioData);
    visualize(audioData, context, width, height);
  };
};

canvasSketch(sketch, settings);
