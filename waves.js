const canvasSketch = require('canvas-sketch');
const { mapRange } = require('canvas-sketch-util/math');
const { rangeFloor, range } = require('canvas-sketch-util/random');

const cvWidth = 1080;
const cvHeight = 1080;

const fftSize = 64;
const volume = 0.1;
const numWaves = 10;
const rowSize = cvHeight * 0.9;
const colSize = cvWidth;

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
  constructor({ x, y, width, height, freq }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.freq = freq;
    
    this.points = [];
    
    const step = 0.125 * this.width / this.freq;
    let i;
    for (i = 0; i < this.width; i += step) {
      this.points.push({
        x: this.x + i,
        cy: Math.sin((i / this.width) * 2 * Math.PI * freq) * this.height * 0.5 * Math.sin(Math.PI * i / this.width)
      });
    }
    this.points.push({
      x: this.x + this.width,
      cy: 0
    });
    console.log(this.points.length);
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context, amp) {
    let mx, my, nx, ny, px, py;
    px = this.x;
    py = this.y;

    context.save();

    context.beginPath();
    context.moveTo(this.x, this.y);
    for (const p of this.points) {
      nx = p.x;
      ny = this.y + amp * p.cy;
      mx = (px + nx) * 0.5;
      my = (py + ny) * 0.5;
      
      context.quadraticCurveTo(px, py, mx, my);
      
      px = nx;
      py = ny;
    }
    context.quadraticCurveTo(px, py, nx, ny);

    context.strokeStyle = 'black';
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
      freq: range(8, 32),
    }),
    bin: rangeFloor(0, numWaves * 2)
  });
}

/**
 * 
 * @param { Uint8Array } audioData
 * @param { CanvasRenderingContext2D } context 
 */
function visualize(audioData, context) {
  let amp;
  for (const w of waves) {
    amp = mapRange(audioData[w.bin], 0, 255, 0, 1, true);
    w.wave.draw(context, amp);
  }
}


const sketch = () => {
  addListeners();
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    if (!audioContext) {
      return;
    }
    analyserNode.getByteFrequencyData(audioData);
    visualize(audioData, context);
  };
};

canvasSketch(sketch, settings);
