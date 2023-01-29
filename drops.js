const canvasSketch = require('canvas-sketch');
const { clamp, mapRange } = require('canvas-sketch-util/math');
const { rangeFloor } = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');

const cvWidth = 1080;
const cvHeight = 1080;

const fftSize = 64;
const volume = 0.1;
const numBins = 16;
const maxThreshold = 30;

/** @type { HTMLAudioElement } */
let audio;

/** @type { AudioContext } */
let audioContext;

/** @type { Uint8Array } */
let audioData;

/** @type { number[] } */
let previousBins = Array(numBins).fill(0);

/** @type { MediaElementAudioSourceNode } */
let sourceNode;

/** @type { AnalyserNode } */
let analyserNode;

const settings = {
  dimensions: [ cvWidth, cvHeight ],
  animate: true,
};

const bins = Array(numBins).fill().map( () => ({ 
  bin: rangeFloor(0, 16),
  x : rangeFloor(0, cvWidth),
  y: rangeFloor(0, cvHeight),
  threshold: rangeFloor(1, maxThreshold),
  color: risoColors[rangeFloor(0, risoColors.length)].hex
}));

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

class Drop {
  /**
   * 
   * @param { number } x 
   * @param { number } y 
   * @param { number } size 
   * @param { string } color
   */
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.maxSize = size;
    this.currentSize = 1;
    this.speed = 100 * size / cvWidth;
    console.log(this.speed);
    this.active = true;
    this.color = color;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    if (!this.active) {
      return;
    }
    context.save();

    context.beginPath();
    context.translate(this.x, this.y);
    context.arc(0, 0, this.currentSize, 0, Math.PI * 2);
    context.strokeStyle = this.color;
    context.lineWidth = clamp(this.speed, 1, 10);
    context.stroke();

    context.restore();
  }

  update() {
    if (!this.active) {
      return;
    }

    this.currentSize += this.speed;
    this.speed *= 0.9;
    this.active = this.currentSize < this.maxSize && this.speed > 0.1;

  }
}

/** @type { Drop[] } */
const drops = [];

/**
 * 
 * @param { Uint8Array } audioData
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
function visualize(audioData, context, width, height) {
  let bin, size, i, drop, x, y, color;
  for (i = 0; i < numBins; i++) {
    bin = bins[i];
    if (audioData[bin.bin] === 0) {
      previousBins[i] = 0;
      continue;
    }
    if (audioData[bin.bin] - previousBins[i] > bin.threshold ) {
      x = bin.x;
      y = bin.y;
      size = mapRange(audioData[bin.bin], 0, 255, 0, width);
      color= bin.color;
      drops.push(new Drop(x, y, size, color));
    }
    previousBins[i] = audioData[bin.bin];
  }

  i = 0;
  while (i < drops.length) {
    drop = drops[i];
    drop.update();
    drop.draw(context);
    if (drop.active) {
      i++;
    } else {
      drops.splice(i, 1);
    }
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
    visualize(audioData, context, width, height);
  };
};

canvasSketch(sketch, settings);
