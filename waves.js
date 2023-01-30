const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { rangeFloor, range } = require('canvas-sketch-util/random');
const colorMap = require('colormap');

const cvWidth = 512;
const cvHeight = 512;

const bgColor = 'black';
const colorMapType = 'winter';
const waveLineWidth = 1;

const fftSize = 64;
const volume = 0.1;
const numWaves = 12;
const rowSize = cvHeight * 0.9;
const colSize = cvWidth;
const baseOffset = 0.5;
const wavesColor = colorMap({
  colormap: colorMapType,
  nshades: numWaves > 9 ? numWaves : 9,
  format: 'hex',
  alpha: 1
});

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

function addListeners() {
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

class Wave {
  constructor({ x, y, width, height, freq, color }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.freq = freq;
    this.color = color;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   * @param { number } amp
   * @param { number } offset
   */
  draw(context, amp, offset) {
    let mx, my, nx, ny, px, py, cy;
    px = this.x;
    py = this.y;

    context.save();

    context.beginPath();
    context.moveTo(this.x, this.y);
    const step = 0.125 * this.width / this.freq;
    for (let i = 0; i < this.width; i += step) {
      nx = this.x + i;
      cy = Math.sin(offset + (i / this.width) * 2 * Math.PI * this.freq) * this.height * 0.5 * Math.sin(Math.PI * i / this.width)
      ny = this.y + amp * cy;
      mx = (px + nx) * 0.5;
      my = (py + ny) * 0.5;

      context.quadraticCurveTo(px, py, mx, my);

      px = nx;
      py = ny;
    }
    context.quadraticCurveTo(mx, my, nx, ny);
    context.lineTo(this.x + this.width, this.y);

    context.strokeStyle = this.color;
    context.lineWidth = waveLineWidth;
    context.stroke();

    context.restore();
  }
}

/** @type { Wave[] } */
const waves = [];

for (let i = 0; i < numWaves; i++) {
  waves.push({
    wave: new Wave({
      x: (cvWidth - colSize) * 0.5,
      y: cvHeight * 0.5,
      width: colSize,
      height: rowSize,
      freq: range(8, 16),
      color: wavesColor[i]
    }),
    bin: rangeFloor(0, numWaves * 2)
  });
}

/**
 * 
 * @param { Uint8Array } audioData
 * @param { CanvasRenderingContext2D } context 
 * @param { number } frame
 */
function visualize(audioData, context, frame) {
  let amp;
  for (const w of waves) {
    amp = mapRange(audioData[w.bin], 0, 255, 0, 1, true);
    w.wave.draw(context, amp, frame * baseOffset);
  }
}


const sketch = () => {
  addListeners();
  return ({ context, width, height, frame }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    if (!audioContext) {
      return;
    }
    analyserNode.getByteFrequencyData(audioData);
    visualize(audioData, context, frame);
  };
};

canvasSketch(sketch, settings);
