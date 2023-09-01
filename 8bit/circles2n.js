const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const seed = random.getRandomSeed();
const { loadImage, getImageBrightness } = require('../images');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: `circles-2n-${seed}`
};

const margin = 25;
const rows = 8;
const cols = 8;

const palletes = [
  ['#ea7af4', '#b43e8f', '#6200b3', '#3b0086', '#290628'],
  ['#ffe169', '#edc531', '#c9a227', '#a47e1b', '#805b10'],
  ['#caf0f8', '#90e0ef', '#00b4d8', '#0077b6', '#03045e'],
  ['#c7f9cc', '#80ed99', '#57cc99', '#38a3a5', '#22577a'],
  ['#f9dbbd', '#ffa5ab', '#da627d', '#a53860', '#450920'],
];

const sketch = async () => {
  image = await loadImage('images/girl-128.jpg');
  imageBrightness = getImageBrightness(image);
  return ({ context, width, height }) => {
    random.setSeed(seed);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const pw = ( width - margin * 2 ) / cols;
    const ph = ( height - margin * 2 ) / rows;
    let x, y, size, radius, pallete, color, ix, iy, ratio;

    for (let i = 0; i < rows; i++) {
      y = i * ph;
      for (let j = 0; j < cols; j++) {
        x = j * pw;
        context.save();
        context.translate(x + margin, y + margin);
        size = 16;
        radius = pw / size;
        pallete = random.pick(palletes);
        for (let ii = 0; ii < size; ii++) {
          for (let jj = 0; jj < size; jj++) {
            ix = Math.floor(math.mapRange(x + margin + ii * radius, 0, width, 0, image.width));
            iy = Math.floor(math.mapRange(y + margin + jj * radius, 0, height, 0, image.height));
            idx = iy * image.width + ix;
            color = pallete[Math.floor(math.mapRange(imageBrightness[idx], 0, 255, pallete.length, 0))];
            ratio = math.mapRange(imageBrightness[idx], 0, 255, 0.15, 1.15);
            
            context.beginPath()
            context.arc((ii + 0.5) * radius, (jj + 0.5) * radius, ratio * radius * 0.5, 0, Math.PI * 2);
            context.fillStyle = color;
            context.fill();
            
            
            /*context.beginPath()
            context.fillStyle = color;
            context.strokeStyle = color;
            context.rect(ii * radius, jj * radius, radius, radius);
            context.stroke();
            context.fill();*/
           
          }
        }
        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings);
