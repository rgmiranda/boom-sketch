import { Vector } from "./vector.js";

/**
 * 
 * @param { Vector } p 
 * @param { Vector } q 
 * @param { Vector } r 
 * @returns { boolean }
 */
export function isOnSegment(p, q, r) {
  if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
    return true;

  return false;
}

/**
 * To find orientation of ordered triplet (p, q, r).
 * The function returns following values 
 * 
 * @param { Vector } p 
 * @param { Vector } q 
 * @param { Vector } r 
 * @returns { number } 0 when p, q and r are collinear; -1 when clockwise, 1 counterclockwise
 */
export function getOrientation(p, q, r) {

  // See https://www.geeksforgeeks.org/orientation-3-ordered-points/ 
  // for details of below formula. 
  let val = (q.y - p.y) * (r.x - q.x) -
    (q.x - p.x) * (r.y - q.y);

  if (val == 0) return 0; // collinear 

  return (val > 0) ? -1 : 1; // clock or counterclock wise 
}

/**
 * 
 * The main function that returns true if line segment 'p1q1' 
 * and 'p2q2' intersect. 
 * @param { Vector } p1 
 * @param { Vector } q1 
 * @param { Vector } p2 
 * @param { Vector } q2 
 * @returns { boolean }
 */
export function doIntersect(p1, q1, p2, q2) {

  // Find the four orientations needed for general and 
  // special cases 
  let o1 = getOrientation(p1, q1, p2);
  let o2 = getOrientation(p1, q1, q2);
  let o3 = getOrientation(p2, q2, p1);
  let o4 = getOrientation(p2, q2, q1);

  // General case 
  if (o1 != o2 && o3 != o4)
    return true;

  // Special Cases 
  // p1, q1 and p2 are collinear and p2 lies on segment p1q1 
  if (o1 == 0 && isOnSegment(p1, p2, q1)) return true;

  // p1, q1 and q2 are collinear and q2 lies on segment p1q1 
  if (o2 == 0 && isOnSegment(p1, q2, q1)) return true;

  // p2, q2 and p1 are collinear and p1 lies on segment p2q2 
  if (o3 == 0 && isOnSegment(p2, p1, q2)) return true;

  // p2, q2 and q1 are collinear and q1 lies on segment p2q2 
  if (o4 == 0 && isOnSegment(p2, q1, q2)) return true;

  return false; // Doesn't fall in any of the above cases 
}

/**
 * 
 * @param { Vector } p1 
 * @param { Vector } q1 
 * @param { Vector } p2 
 * @param { Vector } q2 
 * @returns { Vector }
 */
export function getSegmentsIntersectionPoint(p1, q1, p2, q2) {
  // First equation: y = a x + b;
  const a = q1.x !== p1.x ? (q1.y - p1.y) / (q1.x - p1.x) : NaN;
  const b = isNaN(a) ? p1.x : -1 * a * p1.x + p1.y;
  
  // Second equation: y = c x + d
  const c = q2.x !== p2.x ? (q2.y - p2.y) / (q2.x - p2.x) : NaN;
  const d = isNaN(c) ? p2.x : -1 * c * p2.x + p2.y;

  const r = getLineIntersectionPoint(a, b, c, d);

  if (r.y < Math.min(p1.y, q1.y)) {
    throw new Error('No intersection point');
  }
  if (r.y > Math.max(p1.y, q1.y)) {
    throw new Error('No intersection point');
  }
  if (r.y < Math.min(p2.y, q2.y)) {
    throw new Error('No intersection point');
  }
  if (r.y > Math.max(p2.y, q2.y)) {
    throw new Error('No intersection point');
  }
  return r;
}

/**
 * 
 * @param { number } a 
 * @param { number } b 
 * @param { number } c 
 * @param { number } d
 * @returns { Vector }
 */
export function getLineIntersectionPoint(a, b, c, d) {

  let x, y;

  if (a === c) {
    throw new Error('The slopes are equal');
  }

  if (isNaN(a)) {
    x = b;
    y = c * x + d;
  } else if (isNaN(c)) {
    x = d;
    y = a * x + b;
  } else {
    x = (d - b) / (a - c);
    y = a * x + b;
  }

  return new Vector(x, y);
}

/**
 * 
 * @param { Vector } p 
 * @param { Vector } q 
 * @returns { { m: number, b: number } }
 */
export function getLineFunction(p, q) {
  let m, b;
  if (p.x === q.x) {
    m = NaN;
    b = q.x;
  } else {
    m = (p.y - q.y) / (p.x - q.x);
    b = p.y - m * p.x;
  }
  return {
    m,
    b
  }
}

/**
 * 
 * @param { Vector } p 
 * @param { Vector } q 
 * @returns { { m: number, b: number } }
 */
export function getMediatrix(p, q) {
  const a = q.copy();
  a.sub(p);
  a.mult(0.5);
  const b = Vector.fromAngle(a.angle + Math.PI * 0.5);

  a.add(p);
  b.add(a);

  return getLineFunction(a, b);
}

/**
 * 
 * @param { number } m 
 * @param { number } b 
 * @param { Vector } p 
 * @returns { Vector }
 */
export function getNormalPoint(m, b, p) {
  let nm;
  if (m === 0) {
    nm = NaN;
  } else if (isNaN(m)) {
    nm = 0;
  } else {
    nm = -1/m;
  }
  const nb = isNaN(nm) ? p.x : p.y - nm * p.x;
  return getLineIntersectionPoint(m, b, nm, nb);
}
