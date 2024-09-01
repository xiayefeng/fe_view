import {multiply} from '../common/lib/math/functions/mat3fun.js';

const rad = Math.PI / 6;
const a = [
  Math.cos(rad), -Math.sin(rad), 0,
  Math.sin(rad), Math.cos(rad), 0,
  0, 0, 1
];

const b = [
  1, 0, 100,
  0, 1, 50,
  0, 0, 1
];

const c = [
  1.5, 0, 0,
  0, 1.5, 0,
  0, 0, 1
];

const res = [a, b, c].reduce((a, b) => {
  return multiply([], b, a);
});

console.log(res);
/*
[1.299038105676658, -0.7499999999999999, 61.60254037844388, 
  0.7499999999999999, 1.299038105676658, 93.30127018922192,
  0, 0, 1]
*/
