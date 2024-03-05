const canvasSketch = require('canvas-sketch');
const { Turtle } = require('./turtle');
const { LSystem } = require('./lsystem');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `crack-${Date.now()}`
};

/**
 * @type { LSystem[] }
*/
const systems = [
  new LSystem('[[F]++++[F]++++[F]++++[F]++++[F]++++[F]]', ['F => FD[---F][GGF][+++F]U']),
  new LSystem('[[GF]++++[GF]++++[GF]++++[GF]++++[GF]++++[GF]]', ['F => FD[---GF][--F][++++++++GF]U']),
  new LSystem('[[GF]++++[GF]++++[GF]++++[GF]++++[GF]++++[GF]]', ['F => FD[-GF][-F][+++++++++GF]U']),
  new LSystem('[[GF]++++[GF]++++[GF]++++[GF]++++[GF]++++[GF]]', ['F => FD[----F][GF][++++F]U']),
  new LSystem('[[GF]++++++++[GF]++++++++[GF]]', ['F => FD[----GF][F][++++GF]U']),
];

const sketch = ({ context }) => {

  const angle = Math.PI / 12 ;
  const scale = 0.65;
  const strokeSize = 85;
  const strokeWeight = 10;
  
  const treeSystem = systems[0];
  treeSystem.generate(6);
  const turtle = new Turtle(context, strokeSize, strokeWeight, angle, scale);

  return ({ context, width, height }) => {

    
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = 'white';
    
    turtle.init(width * 0.5, height * 0.5, -Math.PI * 0.5);
    turtle.render(treeSystem.sentence);
  };
};

canvasSketch(sketch, settings);
