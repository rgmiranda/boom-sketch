const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const colormap = require('colormap');
const cvWidth = 1080;
const cvHeight = 1080;
const fftSize = 2048;
const pulseAngle = 64 * Math.PI / fftSize;
const volume = 0.1;
const minRadius = 0;
const maxRadius = cvWidth * 0.48;

const barsColor = colormap({
  colormap: 'jet',
  nshades: fftSize * 0.5,
  format: 'hex',
  alpha: 1,
})

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

let bars;

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
  audio.src = 'audio/wasteland.mp3';
  audio.volume = volume;
  
  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  sourceNode.connect(analyserNode);

  analyserNode.fftSize = fftSize;
  audioData = new Uint8Array(analyserNode.frequencyBinCount);
}

function createBars() {
  bars = [];
  for (let i = 0; i < fftSize * 0.5; i++) {
    bars.push({
      color: barsColor[i],
      startAngle: i * pulseAngle,
      endAngle: (i + 1) * pulseAngle,
    })
  }
}

const sketch = ({canvas}) => {
  canvas.style.filter = 'blur(5px) contrast(300%)';
  addListeners();
  createBars();
  return ({ context, width, height, frame }) => {
    let radius, idx;
    let color, startAngle, endAngle;

    context.globalAlpha = 0.5;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    if (!audioContext) {
      return;
    }

    analyserNode.getByteFrequencyData(audioData);
    context.save();

    context.translate(width * 0.5, height * 0.5);
    context.lineWidth = 1;
    for (let i = 0; i < audioData.length; i++) {
      context.beginPath();
      idx = ((i + frame) % audioData.length);
      radius = mapRange(audioData[idx], 0, 255, minRadius, maxRadius);
      ({ color, startAngle, endAngle } = bars[i]);
      context.moveTo(0, 0);
      context.arc(0, 0, radius, startAngle, endAngle);
      context.closePath();
      context.fillStyle = color;
      context.strokeStyle = color;
      context.fill();
    }

    context.restore();
  };
};

canvasSketch(sketch, settings);
