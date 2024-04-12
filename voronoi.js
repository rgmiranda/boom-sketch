const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { Vector, Triangle, doIntersect } = require('./calc');
const risoColors = require('riso-colors');
const cvWidth = cvHeight = 1080;
const settings = {
  dimensions: [ cvWidth, cvHeight ]
};

const numPoints = 64;

const colors = [
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
  random.pick(risoColors).hex,
];

/**
 * 
 * @param { Vector[] } points 
 * @param { Triangle[] } triangulation 
 * @param { CanvasRenderingContext2D } context
 * @returns { Triangle[] }
 */
const processPoints = (points, triangulation, context) => {
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
 * @param { Vector[] } points 
 */
const drawPoints = (ctx, points) => {
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = 'red';
  ctx.lineWidth = 1;
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#999999';
  });
};

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { Triangle[] } triangles 
 */
const drawTriangles = (ctx, triangles) => {
  triangles.forEach(({radius, center, a, b, c }) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#630';
    ctx.fillStyle = '#9AF';
    
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.closePath();
    ctx.stroke();
    
    ctx.strokeStyle = '#BBB';
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    ctx.stroke();
  });
};

/**
 * 
 * @param { Triangle[] } triangles 
 * @returns { Vector[][] }
 */
const processTriangulation = (triangles) => {
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

/**
 * 
 * @param { CanvasRenderingContext2D } ctx 
 * @param { Triangle[] } triangles 
 */
const drawVoronoi = (ctx, triangles) => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#036';
  ctx.fillStyle = '#9AF';
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

const sketch = ({ width, height }) => {

  const A = new Vector(0, 0);
  const B = new Vector(width, 0);
  const C = new Vector(width, height);
  const D = new Vector(0, height);

  /**
   * @type { Vector[] }
   */
  const points = Array(numPoints).fill(0).map(() => new Vector(random.range(0, width), random.range(0, height)));

  /**
   * @type { Triangle[] }
   */
  let triangulation = [
    new Triangle(A, C, D),
    new Triangle(A, B, C),
  ];
  
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    
    triangulation = processPoints(points, triangulation, context);
    //triangulation = triangulation.filter(t => !(t.hasVertex(A) || t.hasVertex(B) || t.hasVertex(C) || t.hasVertex(D)));
    drawVoronoi(context, triangulation);
    //drawTriangles(context, triangulation);
    drawPoints(context, points);
  };
};

canvasSketch(sketch, settings);
