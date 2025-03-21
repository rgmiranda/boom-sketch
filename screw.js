const canvasSketch = require('canvas-sketch');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'screw',
  animate: true,
};

const numLines = 3;

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 */
const drawLines = (context, width, height) => {
  context.fillStyle = 'white';
  context.fillRect(-width * 0.5, -height * 0.5, width, height);
  context.strokeStyle = 'black';
  const lineWidth = width / (numLines * 2);
  context.lineWidth = lineWidth;
  for (let i = 0; i < numLines; i++) {
    const x = 2 * (i + 0.5) * lineWidth - width * 0.5;
    context.beginPath();
    context.moveTo(x, -height * 0.5);
    context.lineTo(x, height * 0.5);
    context.stroke();
  }
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { number } width 
 * @param { number } height 
 * @param { number } radius 
 * @param { number } angle 
 */
const clip = (context, width, height, radius, angle) => {
  context.translate(width * 0.5, height * 0.5);
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.closePath();
  context.clip();
  context.rotate(angle);
};

/** @type { { radius: number, speed: number, fromAngle: number, angle: number, position: number, moving: boolean}[] } */
const turns = [
  {
    radius: 480,
    speed: 0.01,
    fromAngle: 0,
    angle: Math.PI * 0.25,
    position: 0.5,
    moving: false,
  },
  {
    radius: 330,
    speed: 0.01,
    fromAngle: 0,
    angle: Math.PI * 0.25,
    position: 0.5,
    moving: false,
  },
  {
    radius: 180,
    speed: 0.01,
    fromAngle: 0,
    angle: Math.PI * 0.25,
    position: 0.5,
    moving: false,
  },
];

/**
 * 
 * @param { {
 *   radius: number,
 *   speed: number,
 *   fromAngle: number,
 *   angle: number,
 *   position: number,
 *   moving: boolean
 * } } turn 
 */
const updateTurn = (turn) => {
  const {
    speed,
    position,
    moving
  } = turn;

  if (moving && position < 1) {
    turn.position += speed;
    if (turn.position >= 1) {
      turn.moving = false;
    }
    return;
  }

  turn.fromAngle += turn.angle;
  turn.angle = Math.random() * Math.PI - Math.PI * 0.5;
  turn.moving = true;
  turn.position = 0;
  turn.speed = Math.random() * 0.01 + 0.01;

};

const sketch = () => {
  return ({ context, width, height }) => {

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    turns.forEach(turn => {
      context.save();
      const {
        radius,
        fromAngle,
        angle,
        position
      } = turn;

      updateTurn(turn);
      const currentAngle = fromAngle + eases.quartInOut(position) * angle;
      clip(context, width, height, radius, currentAngle);
      drawLines(context, width, height);

      context.restore();
    });

  };
};

canvasSketch(sketch, settings);
