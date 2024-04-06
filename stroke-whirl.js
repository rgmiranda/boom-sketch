const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');
const eases = require('eases');
const numStrokes = 1024 * 3;
const strokeAngle = Math.PI / 6;
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `pen-whirl-${seed}`,
};

const colors = [
  //'#3D5588',
  '#d2515e',
  // Green
  //'#19975d',
];

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { { angle: number; length: number; radius: number; lineWidth: number; }[] } strokes 
 */
const stroke = (ctx, strokes) => {
  const strokeCos = Math.cos(strokeAngle);
  const strokeSin = Math.sin(strokeAngle);
  strokes.forEach(({ angle, length, radius, lineWidth }) => {
    ctx.save();
    ctx.rotate(angle);
    ctx.translate(0, radius);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = random.pick(colors);
    ctx.beginPath();
    ctx.moveTo( 0, 0 );
    ctx.lineTo( strokeCos * Math.min(length, radius), strokeSin * Math.min(length, radius) );
    ctx.stroke();

    ctx.restore();
  });
}

const sketch = () => {
  random.setSeed(seed);
  /**
   * @type { { angle: number; length: number; radius: number; lineWidth: number; }[] }
   */
  const strokes = Array(numStrokes).fill(0).map(() => ({
    angle: random.range(0, Math.PI * 2),
    length: random.range(30, 200),
    radius: math.lerp(0, 1080 * Math.SQRT1_2, random.value()),
    lineWidth: random.range(0.5, 2),
  }));
  return ({ context, width, height }) => {
    context.fillStyle = '#f6eee3';
    context.fillRect(0, 0, width, height);
    
    context.translate(width * 0.5, height * 0.5);
    stroke(context, strokes);
  };
};

canvasSketch(sketch, settings);
