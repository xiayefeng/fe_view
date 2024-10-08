import { Renderer, Program, Geometry, Transform, Mesh } from '../common/lib/ogl/index.mjs';

const vertex = `
  attribute vec2 position;

  void main() {
    gl_PointSize = 10.0;
    float scale = 1.0 / 256.0;
    mat3 projectionMatrix = mat3(
      scale, 0, 0,
      0, -scale, 0,
      -1, 1, 1
    );
    vec3 pos = projectionMatrix * vec3(position, 1);
    gl_Position = vec4(pos.xy, 0, 1);
  }
`;


const fragment = `
  precision highp float;
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
`;

const canvas = document.querySelector('canvas');
const renderer = new Renderer({
  canvas,
  width: 512,
  height: 512,
});

const gl = renderer.gl;
gl.clearColor(1, 1, 1, 1);


const program = new Program(gl, {
  vertex,
  fragment,
});

const geometry = new Geometry(gl, {
  position: {
    size: 2,
    data: new Float32Array(
      [
        100, 100,
        100, 200,
        200, 150,
        300, 200,
        300, 100,
      ],
    )
  },
});

const scene = new Transform();
const polyline = new Mesh(gl, { geometry, program, mode: gl.LINE_STRIP });
polyline.setParent(scene);

renderer.render({ scene });

function extrudePolyline (gl, points, { thickness = 10 } = {}) {
  const halfThick = 0.5 * thickness;
  const innerSide = [];
  const outerSide = [];

  // 构建挤压顶点
  for (let i = 1; i < points.length - 1; i++) {
    const v1 = (new Vec2()).sub(points[i], points[i - 1]).normalize();
    const v2 = (new Vec2()).sub(points[i], points[i + 1]).normalize();
    const v = (new Vec2()).add(v1, v2).normalize(); // 得到挤压方向
    const norm = new Vec2(-v1.y, v1.x); // 法线方向
    const cos = norm.dot(v);
    const len = halfThick / cos;
    if (i === 1) { // 起始点
      const v0 = new Vec2(...norm).scale(halfThick);
      outerSide.push((new Vec2()).add(points[0], v0));
      innerSide.push((new Vec2()).sub(points[0], v0));
    }
    v.scale(len);
    outerSide.push((new Vec2()).add(points[i], v));
    innerSide.push((new Vec2()).sub(points[i], v));
    if (i === points.length - 2) { // 结束点
      const norm2 = new Vec2(v2.y, -v2.x);
      const v0 = new Vec2(...norm2).scale(halfThick);
      outerSide.push((new Vec2()).add(points[points.length - 1], v0));
      innerSide.push((new Vec2()).sub(points[points.length - 1], v0));
    }
  }
  // ...
}

function extrudePolyline (gl, points, { thickness = 10 } = {}) {
  // ...
  const count = innerSide.length * 4 - 4;
  const position = new Float32Array(count * 2);
  const index = new Uint16Array(6 * count / 4);

  // 创建 geometry 对象
  for (let i = 0; i < innerSide.length - 1; i++) {
    const a = innerSide[i],
      b = outerSide[i],
      c = innerSide[i + 1],
      d = outerSide[i + 1];

    const offset = i * 4;
    index.set([offset, offset + 1, offset + 2, offset + 2, offset + 1, offset + 3], i * 6);
    position.set([...a, ...b, ...c, ...d], i * 8);
  }

  return new Geometry(gl, {
    position: { size: 2, data: position },
    index: { data: index },
  });
}

const geometry2 = extrudePolyline(gl, points, {lineWidth: 10});

const scene2 = new Transform();
const polyline2 = new Mesh(gl, {geometry2, program});
polyline2.setParent(scene2);

renderer.render({scene2});

