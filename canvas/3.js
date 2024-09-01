import {earcut} from '../common/lib/earcut.js';
import {Vector2D} from '../common/lib/vector2d.js';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');


const vertices = [
  [-0.7, 0.5],
  [-0.4, 0.3],
  [-0.25, 0.71],
  [-0.1, 0.56],
  [-0.1, 0.13],
  [0.4, 0.21],
  [0, -0.6],
  [-0.3, -0.3],
  [-0.6, -0.3],
  [-0.45, 0.0],
];


const points = vertices.flat();
const triangles = earcut(points);

const position = new Float32Array(points);
const cells = new Uint16Array(triangles);


const pointBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);


const vPosition = gl.getAttribLocation(program, 'position');
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);


const cellsBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cellsBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cells, gl.STATIC_DRAW);


gl.clear(gl.COLOR_BUFFER_BIT);
// gl.drawElements(gl.TRIANGLES, cells.length, gl.UNSIGNED_SHORT, 0); // 实心
gl.drawElements(gl.LINE_STRIP, cells.length, gl.UNSIGNED_SHORT, 0); // 空心

// 判断点在多边形内部
const {left, top} = canvas.getBoundingClientRect();

canvas.addEventListener('mousemove', (evt) => {
  const {x, y} = evt;
  // 坐标转换
  const offsetX = x - left;
  const offsetY = y - top;

  ctx.clearRect(-256, -256, 512, 512);

  if(ctx.isPointInPath(offsetX, offsetY)) {
    draw(ctx, position, 'transparent', 'green');
  } else {
    draw(ctx, position, 'transparent', 'red');
  }
});

draw(ctx, position, 'transparent', 'red');
draw(ctx, [[100, 100], [100, 200], [150, 200]], 'transparent', 'blue');

// const {left, top} = canvas.getBoundingClientRect();

canvas.addEventListener('mousemove', (evt) => {
  const {x, y} = evt;
  // 坐标转换
  const offsetX = x - left;
  const offsetY = y - top;
  
  ctx.clearRect(-256, -256, 512, 512);
  
  // 判断 offsetX、offsetY 的坐标是否在多边形内部
  if(ctx.isPointInPath(offsetX, offsetY)) {
    draw(ctx, position, 'transparent', 'green');
    draw(ctx, [[100, 100], [100, 200], [150, 200]], 'transparent', 'orange');
  } else {
    draw(ctx, position, 'transparent', 'red');
    draw(ctx, [[100, 100], [100, 200], [150, 200]], 'transparent', 'blue');
  }
});

function isPointInPath(ctx, x, y) {
  // 我们根据ctx重新clone一个新的canvas对象出来
  const cloned = ctx.canvas.cloneNode().getContext('2d');
  cloned.translate(0.5 * width, 0.5 * height);
  cloned.scale(1, -1);
  let ret = false;
  // 绘制多边形c，然后判断点是否在图形内部
  draw(cloned, position, 'transparent', 'red');
  ret |= cloned.isPointInPath(x, y);
  if(!ret) {
    // 如果不在，在绘制小三角形，然后判断点是否在图形内部
    draw(cloned, [[100, 100], [100, 200], [150, 200]], 'transparent', 'blue');
    ret |= cloned.isPointInPath(x, y);
  }
  return ret;
}

function inTriangle(p1, p2, p3, point) {
  const a = p2.copy().sub(p1);
  const b = p3.copy().sub(p2);
  const c = p1.copy().sub(p3);

  const u1 = point.copy().sub(p1);
  const u2 = point.copy().sub(p2);
  const u3 = point.copy().sub(p3);

  const s1 = Math.sign(a.cross(u1));
  const s2 = Math.sign(b.cross(u2));
  const s3 = Math.sign(c.cross(u3));

  return s1 === s2 && s2 === s3;
}

function inTriangle2(p1, p2, p3, point) {
  const a = p2.copy().sub(p1);
  const b = p3.copy().sub(p2);
  const c = p1.copy().sub(p3);

  const u1 = point.copy().sub(p1);
  const u2 = point.copy().sub(p2);
  const u3 = point.copy().sub(p3);

  const s1 = Math.sign(a.cross(u1));
  let p = a.dot(u1) / a.length ** 2;
  if(s1 === 0 && p >= 0 && p <= 1) return true;

  const s2 = Math.sign(b.cross(u2));
  p = b.dot(u2) / b.length ** 2;
  if(s2 === 0 && p >= 0 && p <= 1) return true;

  const s3 = Math.sign(c.cross(u3));
  p = c.dot(u3) / c.length ** 2;
  if(s3 === 0 && p >= 0 && p <= 1) return true;

  return s1 === s2 && s2 === s3;
}

function isPointInPath2({vertices, cells}, point) {
  let ret = false;
  for(let i = 0; i < cells.length; i += 3) {
    const p1 = new Vector2D(...vertices[cells[i]]);
    const p2 = new Vector2D(...vertices[cells[i + 1]]);
    const p3 = new Vector2D(...vertices[cells[i + 2]]);
    if(inTriangle2(p1, p2, p3, point)) {
      ret = true;
      break;
    }
  }
  return ret;
}









