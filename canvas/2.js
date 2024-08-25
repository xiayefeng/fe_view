import {Vector2D} from '../common/lib/vector2d.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const {width, height} = canvas;
ctx.translate(0.5 * width, 0.5 * height);
ctx.scale(1, -1);

function regularShape(edges = 3, x, y, step) {
  const ret = [];
  const delta = Math.PI * (1 - (edges - 2) / edges);
  let p = new Vector2D(x, y);
  const dir = new Vector2D(step, 0);
  ret.push(p);
  for(let i = 0; i < edges; i++) {
    p = p.copy().add(dir.rotate(delta));
    ret.push(p);
  }
  return ret;
}

function draw(points, strokeStyle = 'black', fillStyle = null) {
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for(let i = 1; i < points.length; i++) {
    ctx.lineTo(...points[i]);
  }
  ctx.closePath();
  if(fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  ctx.stroke();
}

draw(regularShape(3, 128, 128, 100)); // 绘制三角形
draw(regularShape(6, -64, 128, 50));  // 绘制六边形

draw(regularShape(11, -64, -64, 30)); // 绘制十一边形
draw(regularShape(60, 128, -64, 6)); // 绘制六十边形

// 画圆
const TAU_SEGMENTS = 60;
const TAU = Math.PI * 2;
function arc(x0, y0, radius, startAng = 0, endAng = Math.PI * 2) {
  const ang = Math.min(TAU, endAng - startAng);
  const ret = ang === TAU ? [] : [[x0, y0]];
  const segments = Math.round(TAU_SEGMENTS * ang / TAU);
  for(let i = 0; i <= segments; i++) {
    const x = x0 + radius * Math.cos(startAng + ang * i / segments);
    const y = y0 + radius * Math.sin(startAng + ang * i / segments);
    ret.push([x, y]);
  }
  return ret;
}

draw(arc(0, 0, 100));


// 椭圆

const TAU_SEGMENTS2 = 60;
const TAU2 = Math.PI * 2;
function ellipse(x0, y0, radiusX, radiusY, startAng = 0, endAng = Math.PI * 2) {
  const ang = Math.min(TAU2, endAng - startAng);
  const ret = ang === TAU2 ? [] : [[x0, y0]];
  const segments = Math.round(TAU_SEGMENTS2 * ang / TAU2);
  for(let i = 0; i <= segments; i++) {
    const x = x0 + radiusX * Math.cos(startAng + ang * i / segments);
    const y = y0 + radiusY * Math.sin(startAng + ang * i / segments);
    ret.push([x, y]);
  }
  return ret;
}

draw(ellipse(0, 0, 100, 50));


// 抛物线
const LINE_SEGMENTS = 60;
function parabola(x0, y0, p, min, max) {
  const ret = [];
  for(let i = 0; i <= LINE_SEGMENTS; i++) {
    const s = i / 60;
    const t = min * (1 - s) + max * s;
    const x = x0 + 2 * p * t ** 2;
    const y = y0 + 2 * p * t;
    ret.push([x, y]);
  }
  return ret;
}

draw(parabola(0, 0, 5.5, -10, 10));



// 根据点来绘制图形
function draw(points, context, {
  strokeStyle = 'black',
  fillStyle = null,
  close = false,
} = {}) {
  context.strokeStyle = strokeStyle;
  context.beginPath();
  context.moveTo(...points[0]);
  for(let i = 1; i < points.length; i++) {
    context.lineTo(...points[i]);
  }
  if(close) context.closePath();
  if(fillStyle) {
    context.fillStyle = fillStyle;
    context.fill();
  }
  context.stroke();
}

export function parametric(xFunc, yFunc) {
  return function (start, end, seg = 100, ...args) {
    const points = [];
    for(let i = 0; i <= seg; i++) {
      const p = i / seg;
      const t = start * (1 - p) + end * p;
      const x = xFunc(t, ...args); // 计算参数方程组的x
      const y = yFunc(t, ...args);  // 计算参数方程组的y
      points.push([x, y]);
    }
    return {
      draw: draw.bind(null, points),
      points,
    };
  };
}

// 抛物线参数方程
const para = parametric(
  t => 25 * t,
  t => 25 * t ** 2,
);

// 绘制抛物线
para(-5.5, 5.5).draw(ctx);


const helical = parametric(
  (t, l) => l * t * Math.cos(t),
  (t, l) => l * t * Math.sin(t),
);

helical(0, 50, 500, 5).draw(ctx, {strokeStyle: 'blue'});


const star = parametric(
  (t, l) => l * Math.cos(t) ** 3,
  (t, l) => l * Math.sin(t) ** 3,
);

star(0, Math.PI * 2, 50, 150).draw(ctx, {strokeStyle: 'red'});


const quadricBezier = parametric(
  (t, [{x: x0}, {x: x1}, {x: x2}]) => (1 - t) ** 2 * x0 + 2 * t * (1 - t) * x1 + t ** 2 * x2,
  (t, [{y: y0}, {y: y1}, {y: y2}]) => (1 - t) ** 2 * y0 + 2 * t * (1 - t) * y1 + t ** 2 * y2,
);

const p0 = new Vector2D(0, 0);
const p1 = new Vector2D(100, 0);
p1.rotate(0.75);
const p2 = new Vector2D(200, 0);
const count = 30;
for(let i = 0; i < count; i++) {
  // 绘制30条从圆心出发，旋转不同角度的二阶贝塞尔曲线
  p1.rotate(2 / count * Math.PI);
  p2.rotate(2 / count * Math.PI);
  quadricBezier(0, 1, 100, [
    p0,
    p1,
    p2,
  ]).draw(ctx);
}




