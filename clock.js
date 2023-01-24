const canvasSketch = require('canvas-sketch');
const { offsetHSL } = require('canvas-sketch-util/color');
const colormap = require('colormap');
const Tone = require('tone');

const baseAngleSpeed = Math.PI / 180;
const speedRatio = baseAngleSpeed * 0.15;

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

class ClockHand {
  constructor({x, y, angle = 0, radius, speed, color, synth, note }) {
    this.angle = angle;
    this.radius = radius;
    this.speed = speed;
    this.color = color;
    this.strokeColor = offsetHSL(this.color, 0, 0, -10).hex;
    this.size = 20;
    this.x = x;
    this.y = y;
    this.synth = synth;
    this.note = note;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {
    const x = Math.cos(this.angle) * this.radius;
    const y = Math.sin(this.angle) * this.radius;
    context.save();

    context.strokeStyle = this.strokeColor;
    context.fillStyle = this.color;
    context.translate(this.x, this.y);
    context.rotate(Math.PI * 0.5);

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(x, y);
    context.stroke();

    context.beginPath();
    context.arc(x, y, this.size, 0, Math.PI * 2);
    context.closePath();
    context.stroke();
    context.fill();

    context.restore();
  }

  tick() {
    this.angle += this.speed;
    if (this.angle % (Math.PI * 2) <= this.speed) {
      this.synth.triggerAttackRelease(this.note, '8n');
    }
  }
}

class Clock {
  constructor ({ width, height, synth }) {
    const hands = 12;
    const handsColors = colormap({
      colormap: 'rainbow',
      nshades: hands,
      format: 'hex',
      alpha: 1
    });

    const notes = [`C4`, `C#4`, `D4`, `Eb4`, `E4`, `F4`, `F#6`, `G6`, `G#6`, `A6`, `Bb6`, `B6`];

    this.handPadding = (width * 0.5) / (hands + 1);
    this.cx = width * 0.5;
    this.cy = height * 0.5;
    this.hands = [];
    let speed = baseAngleSpeed;
    
    for (let i = hands; i > 0; i--) {
      this.hands.push(new ClockHand({
        x: this.cx,
        y: this.cy,
        color: handsColors[i - 1],
        speed,
        radius: this.handPadding * i,
        synth,
        note: notes[hands - i + 1],
      }));
      speed += speedRatio;
    }
    this.synth = synth;
  }

  /**
   * 
   * @param { CanvasRenderingContext2D } context 
   */
  draw(context) {

    context.save();
    context.beginPath();
    context.moveTo(this.cx, this.cy);
    context.lineTo(this.cx, this.cy * 2);
    context.strokeStyle = 'blue';
    context.lineWidth = 5;
    context.stroke();
    context.restore();

    for( const hand of this.hands) {
      hand.draw(context);
    }
  }

  tick() {
    for( const hand of this.hands) {
      hand.tick();
    }
  }
}

const sketch = ({ width, height, canvas }) => {
  canvas.addEventListener('click', async () => {
    await Tone.start();
  });

  const synth = new Tone.PolySynth(Tone.Synth).toDestination();

  const clock = new Clock({
    width,
    height,
    hands: 12,
    synth
  });

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    clock.tick();
    clock.draw(context);
  };
};

canvasSketch(sketch, settings);
