import {Vector2D} from '../common/lib/vector2d.js';


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const points = [new Vector2D(0, 100)];
for(let i = 1; i <= 4; i++) {
  const p = points[0].copy().rotate(i * Math.PI * 0.4);
  points.push(p);
}

const polygon = [
  ...points,
];

// 绘制正五边形
ctx.save();
ctx.translate(-128, 0);
draw(ctx, polygon);
ctx.restore();

const stars = [
  points[0],
  points[2],
  points[4],
  points[1],
  points[3],
];

// 绘制正五角星
ctx.save();
ctx.translate(128, 0);
draw(ctx, stars);

// draw(ctx, stars, {rule: 'evenodd'}); //空心五角星

ctx.restore();


