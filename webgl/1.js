import {loadImage, getImageData, traverse} from '../lib/utils.js';

const canvas = document.getElementById('paper');
const context = canvas.getContext('2d');

(async function () {
  // 异步加载图片
  const img = await loadImage('assets/girl1.jpg');
  // 获取图片的 imageData 数据对象
  const imageData = getImageData(img);
  // 遍历 imageData 数据对象
  traverse(imageData, ({r, g, b, a}) => { // 对每个像素进行灰度化处理
    const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return [v, v, v, a];
  });
  // 更新canvas内容
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  context.putImageData(imageData, 0, 0);
}());

function gaussianMatrix(radius, sigma = radius / 3) {
  const a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
  const b = -1 / (2 * sigma ** 2);
  let sum = 0;
  const matrix = [];
  for(let x = -radius; x <= radius; x++) {
    const g = a * Math.exp(b * x ** 2);
    matrix.push(g);
    sum += g;
  }

  for(let i = 0, len = matrix.length; i < len; i++) {
    matrix[i] /= sum;
  }
  return {matrix, sum};
}

// 改变亮度，p = 0 全暗，p > 0 且 p < 1 调暗，p = 1 原色， p > 1 调亮
function brightness(p) {
  return [
    p, 0, 0, 0, 0,
    0, p, 0, 0, 0,
    0, 0, p, 0, 0,
    0, 0, 0, 1, 0,
  ];
}

// 饱和度，与grayscale正好相反
// p = 0 完全灰度化，p = 1 原色，p > 1 增强饱和度
function saturate(p) {
  const r = 0.2126 * (1 - p);
  const g = 0.7152 * (1 - p);
  const b = 0.0722 * (1 - p);
  return [
    r + p, g, b, 0, 0,
    r, g + p, b, 0, 0,
    r, g, b + p, 0, 0,
    0, 0, 0, 1, 0,
  ];
}

// 对比度, p = 1 原色， p < 1 减弱对比度，p > 1 增强对比度
function contrast(p) {
  const d = 0.5 * (1 - p);
  return [
    p, 0, 0, 0, d,
    0, p, 0, 0, d,
    0, 0, p, 0, d,
    0, 0, 0, 1, 0,
  ];
}

// 透明度，p = 0 全透明，p = 1 原色
function opacity(p) {
  return [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, p, 0,
  ];
}

// 反色， p = 0 原色， p = 1 完全反色
function invert(p) {
  const d = 1 - 2 * p;
  return [
    d, 0, 0, 0, p,
    0, d, 0, 0, p,
    0, 0, d, 0, p,
    0, 0, 0, 1, 0,
  ]
}

// 色相旋转，将色调沿极坐标转过deg角度
function hueRotate(deg) {
  const rotation = deg / 180 * Math.PI;
  const cos = Math.cos(rotation),
    sin = Math.sin(rotation),
    lumR = 0.2126,
    lumG = 0.7152,
    lumB = 0.0722;
  return [
    lumR + cos * (1 - lumR) + sin * (-lumR), lumG + cos * (-lumG) + sin * (-lumG), lumB + cos * (-lumB) + sin * (1 - lumB), 0, 0,
    lumR + cos * (-lumR) + sin * (0.143), lumG + cos * (1 - lumG) + sin * (0.140), lumB + cos * (-lumB) + sin * (-0.283), 0, 0,
    lumR + cos * (-lumR) + sin * (-(1 - lumR)), lumG + cos * (-lumG) + sin * (lumG), lumB + cos * (1 - lumB) + sin * (lumB), 0, 0,
    0, 0, 0, 1, 0,
  ];
}

