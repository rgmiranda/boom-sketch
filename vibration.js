const { Vector } = require('@rgsoft/math');
const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const seed = random.getRandomSeed();

const particlePad = 10;
const particleSize = 2;
const freq = 0.001;

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `vibration-${seed}`,
  animate: true,
};

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { Vector } particle
 * @param { number } frame
 */
const drawParticle = (context, particle, frame) => {
  const angle = random.range(0, Math.PI * 2);
  const r = random.noise3D(particle.x, particle.y, frame, freq, particleSize * 2);
  const ox = Math.cos(angle) * r;
  const oy = Math.sin(angle) * r;
  context.fillStyle = 'black';
  context.beginPath();
  context.arc(particle.x + ox, particle.y + oy, particleSize, 0, Math.PI * 2);
  context.fill();
};

const sketch = ({ width, height }) => {
  random.setSeed(seed);
  const particles = [];
  for (let y = particlePad * 0.5; y < height; y += particlePad) {
    for (let x = particlePad * 0.5; x < width; x += particlePad) {
      particles.push(new Vector(x, y));
    }
  }
  return ({ context, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    particles.forEach(p => drawParticle(context, p, frame * 10));
  };
};

canvasSketch(sketch, settings);
