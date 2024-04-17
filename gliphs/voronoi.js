const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const { mapRange } = require('canvas-sketch-util/math');
const { getGliphImageData, getDataBrightness } = require('../images');
const { Vector, Triangle } = require('../calc');

const settings = {
  dimensions: [ 1080, 1080 ],
  name: 'voronoi-l'
};

const numCircles = 512;
const cellSize = 50;


/**
 * 
 * @param { Uint8ClampedArray } imageBrightness 
 * @returns { number[] }
 */
const getProbability = (imageBrightness) => {
  let acc = 0;
  const sum = imageBrightness.reduce((prev, val) => prev += val, 0);
  return imageBrightness.map(v => {
    acc += v / sum;
    return acc;
  });
};

/**
 * @param { number } width 
 * @param { number } height 
 * @param { number } cols 
 * @param { number } rows 
 * @param { number[] } probability 
 * @returns { Vector }
 */
const getPoint = (width, height, cols, rows, probability) => {
  const p = random.value();
  const idx = probability.findIndex(v => p < v );
  const ix = idx % cols;
  const iy = Math.floor(idx / rows);
  const x = Math.floor(mapRange(ix, 0, cols - 1, 0, width - 1, true));
  const y = Math.floor(mapRange(iy, 0, rows - 1, 0, height - 1, true));
  const rx = width / cols;
  const ry = height / rows;
  const ox = random.range(0, rx) - rx * 0.5;
  const oy = random.range(0, ry) - ry * 0.5;
  return new Vector(x + ox, y + oy);
};


/**
 * 
 * @param { Vector[] } points 
 * @param { Triangle[] } triangulation 
 * @returns { Triangle[] }
 */
const processPoints = (points, triangulation) => {
  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    /**
     * @type { Triangle[] }
     */
    const badTriangles = triangulation.filter(t => t.inCircle(point));

    /**
     * @type { Vector[] }
     */
    const polygon = [];

    for (let j = 0; j < badTriangles.length; j++) {
      const triangle = badTriangles[j];
      const edges = { a: true, b: true, c: true };
      for (let k = 0; k < badTriangles.length; k++) {
        if (k === j) {
          continue;
        }
        const triangle2 = badTriangles[k];
        edges.a = edges.a && !triangle2.hasEdge(triangle.a, triangle.b);
        edges.b = edges.b && !triangle2.hasEdge(triangle.b, triangle.c);
        edges.c = edges.c && !triangle2.hasEdge(triangle.c, triangle.a);
      }
      if (edges.a) {
        polygon.push(triangle.a, triangle.b);
      }
      if (edges.b) {
        polygon.push(triangle.b, triangle.c);
      }
      if (edges.c) {
        polygon.push(triangle.c, triangle.a);
      }
    }

    triangulation = triangulation.filter(t => !t.inCircle(point));

    for (let j = 0; j < polygon.length; j += 2) {
      triangulation.push(new Triangle(polygon[j], polygon[j + 1], point));
    }

  } // Next point

  return triangulation;
}

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { Triangle[] } triangles 
 */
const drawVoronoi = (ctx, triangles) => {
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  triangles.forEach((triangle, i) => {
    for (let j = i + 1; j < triangles.length; j++) {
      if (!triangle.isAdjacent(triangles[j])) {
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(triangle.center.x, triangle.center.y);
      ctx.lineTo(triangles[j].center.x, triangles[j].center.y);
      ctx.stroke();
    }
  });
};

const sketch = async ({ width, height }) => {

  
  const A = new Vector(0, 0);
  const B = new Vector(width, 0);
  const C = new Vector(width, height);
  const D = new Vector(0, height);

  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const gliphData = getGliphImageData('L', 'serif', cols, rows);
  const imageBrightness = getDataBrightness(gliphData);
  const probability = getProbability(imageBrightness);
  const points = Array(numCircles).fill(0).map(() => getPoint(width, height, cols, rows, probability));

  /**
   * @type { Triangle[] }
   */
  let triangulation = [
    new Triangle(A, C, D),
    new Triangle(A, B, C),
  ];

  triangulation = processPoints(points, triangulation);

  return ({ context }) => {
    context.lineWidth = 2;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    drawVoronoi(context, triangulation);
  };
};

canvasSketch(sketch, settings);
