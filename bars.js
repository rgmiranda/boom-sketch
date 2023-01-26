const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const colormap = require('colormap');
const cvWidth = 1080;
const cvHeight = 1080;
const fftSize = 64;
const volume = 0.1;
const barMinHeight = 0;
const barMaxHeight = cvWidth * 0.4;
const barWidth =  cvWidth / fftSize;

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
 */
function visualize(audioData, context) {
  let barHeight, x, y, color;

  context.save();

  context.lineWidth = 1;
  for (let i = 0; i < audioData.length; i++) {
    barHeight = mapRange(audioData[i], 0, 255, barMinHeight, barMaxHeight);
    x = (cvWidth * 0.5) - (i + 1) * barWidth;
    y = cvHeight - barHeight;
    color = barsColor[i];

    context.fillStyle = color;
    context.strokeStyle = color;
    context.fillRect(x, y, barWidth, barHeight);

    context.fillStyle = 'white';
    context.fillRect(x, y - barWidth - 0.5 * barWidth, barWidth, barWidth);

    x = cvWidth * 0.5 + i * barWidth;

    context.fillStyle = color;
    context.strokeStyle = color;
    context.fillRect(x, y, barWidth, barHeight);

    context.fillStyle = 'white';
    context.fillRect(x, y - barWidth - 0.5 * barWidth, barWidth, barWidth);
  }

  context.restore();
}

const sketch = () => {
  addListeners();
  return ({ context, width, height, frame }) => {

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    if (!audioContext) {
      return;
    }

    analyserNode.getByteFrequencyData(audioData);
    visualize(audioData, context);
  };
};

canvasSketch(sketch, settings);
