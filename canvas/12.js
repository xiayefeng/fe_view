import {multiply} from '../common/lib/math/functions/Mat4Func.js';

```
// vertex shader  顶点着色器
attribute vec2 a_vertexPosition;
attribute vec4 color;

varying vec4 vColor;

void main() {
  gl_PointSize = 1.0;
  vColor = color;
  gl_Position = vec4(a_vertexPosition, 1, 1);
}

```

```
// fragment shader   片元着色器 
#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}

```
// ...
// 顶点信息
renderer.setMeshData([{
  positions: [
    [-0.5, -0.5],
    [-0.5, 0.5],
    [0.5, 0.5],
    [0.5, -0.5],
  ],
  attributes: {
    color: [
      [1, 0, 0, 1],
      [1, 0, 0, 1],
      [1, 0, 0, 1],
      [1, 0, 0, 1],
    ],
  },
  cells: [[0, 1, 2], [0, 2, 3]],
}]);
renderer.render();

```
// vertex shader
attribute vec3 a_vertexPosition;
attribute vec4 color;

varying vec4 vColor;

void main() {
  gl_PointSize = 1.0;
  vColor = color;
  gl_Position = vec4(a_vertexPosition, 1);
}

```

{

  function cube(size = 1.0, colors = [[1, 0, 0, 1]]) {
    const h = 0.5 * size;
    const vertices = [
      [-h, -h, -h],
      [-h, h, -h],
      [h, h, -h],
      [h, -h, -h],
      [-h, -h, h],
      [-h, h, h],
      [h, h, h],
      [h, -h, h],
    ];
  
    const positions = [];
    const color = [];
    const cells = [];
  
    let colorIdx = 0;
    let cellsIdx = 0;
    const colorLen = colors.length;
  
    function quad(a, b, c, d) {
      [a, b, c, d].forEach((i) => {
        positions.push(vertices[i]);
        color.push(colors[colorIdx % colorLen]);
      });
      cells.push(
        [0, 1, 2].map(i => i + cellsIdx),
        [0, 2, 3].map(i => i + cellsIdx),
      );
      colorIdx++;
      cellsIdx += 4;
    }
  
    quad(1, 0, 3, 2);
    quad(4, 5, 6, 7);
    quad(2, 3, 7, 6);
    quad(5, 4, 0, 1);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
  
    return {positions, color, cells};
  }

  const geometry = cube(1.0, [
    [1, 0, 0, 1],
    [0, 0.5, 0, 1],
    [1, 0, 1, 1],
  ]);

  const canvas = document.querySelector('canvas');
const renderer = new GlRenderer(canvas, {
  depth: true,
});

const program = renderer.compileSync(fragment, vertex);
renderer.useProgram(program);

renderer.setMeshData([{
  positions: geometry.positions,
  attributes: {
    color: geometry.color,
  },
  cells: geometry.cells,
}]);
renderer.render();

const vertices = [
  [-h, -h, -h],
  [-h, h, -h],
  [h, h, -h],
  [h, -h, -h],
  [-h, -h, h],
  [-h, h, h],
  [h, h, h],
  [h, -h, h]
]

//立方体的六个面
quad(1, 0, 3, 2); // 红 -- 这一面应该朝内
quad(4, 5, 6, 7);  // 绿 -- 这一面应该朝外
quad(2, 3, 7, 6);  // 蓝
quad(5, 4, 0, 1);  // 红
quad(3, 0, 4, 7);  // 绿
quad(6, 5, 1, 2);  // 蓝


}

```
[
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, -1, 0,
  0, 0, 0, 1
]

attribute vec3 a_vertexPosition;
attribute vec4 color;

varying vec4 vColor;
uniform mat4 projectionMatrix;

void main() {
  gl_PointSize = 1.0;
  vColor = color;
  gl_Position = projectionMatrix * vec4(a_vertexPosition, 1.0);
}


attribute vec3 a_vertexPosition;
attribute vec4 color;


varying vec4 vColor;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;


void main() {
  gl_PointSize = 1.0;
  vColor = color;
  gl_Position = projectionMatrix * modelMatrix * vec4(a_vertexPosition, 1.0);
}


```

{



function fromRotation(rotationX, rotationY, rotationZ) {
  let c = Math.cos(rotationX);
  let s = Math.sin(rotationX);
  const rx = [
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1,
  ];

  c = Math.cos(rotationY);
  s = Math.sin(rotationY);
  const ry = [
    c, 0, s, 0,
    0, 1, 0, 0,
    -s, 0, c, 0,
    0, 0, 0, 1,
  ];

  c = Math.cos(rotationZ);
  s = Math.sin(rotationZ);
  const rz = [
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];

  const ret = [];
  multiply(ret, rx, ry);
  multiply(ret, ret, rz);
  return ret;
}


let rotationX = 0;
let rotationY = 0;
let rotationZ = 0;

function update() {
  rotationX += 0.003;
  rotationY += 0.005;
  rotationZ += 0.007;
  renderer.uniforms.modelMatrix = fromRotation(rotationX, rotationY, rotationZ);
  requestAnimationFrame(update);
}
update();

}

{

  function cylinder(radius = 1.0, height = 1.0, segments = 30, colorCap = [0, 0, 1, 1], colorSide = [1, 0, 0, 1]) {
    const positions = [];
    const cells = [];
    const color = [];
    const cap = [[0, 0]];
    const h = 0.5 * height;
  
    // 顶和底的圆
    for(let i = 0; i <= segments; i++) {
      const theta = Math.PI * 2 * i / segments;
      const p = [radius * Math.cos(theta), radius * Math.sin(theta)];
      cap.push(p);
    }
  
    positions.push(...cap.map(([x, y]) => [x, y, -h]));
    for(let i = 1; i < cap.length - 1; i++) {
      cells.push([0, i, i + 1]);
    }
    cells.push([0, cap.length - 1, 1]);
  
    let offset = positions.length;
    positions.push(...cap.map(([x, y]) => [x, y, h]));
    for(let i = 1; i < cap.length - 1; i++) {
      cells.push([offset, offset + i, offset + i + 1]);
    }
    cells.push([offset, offset + cap.length - 1, offset + 1]);
  
    color.push(...positions.map(() => colorCap));
  
    // 侧面
    offset = positions.length;
    for(let i = 1; i < cap.length; i++) {
      const a = [...cap[i], h];
      const b = [...cap[i], -h];
      const nextIdx = i < cap.length - 1 ? i + 1 : 1;
      const c = [...cap[nextIdx], -h];
      const d = [...cap[nextIdx], h];
  
      positions.push(a, b, c, d);
      color.push(colorSide, colorSide, colorSide, colorSide);
      cells.push([offset, offset + 1, offset + 2], [offset, offset + 2, offset + 3]);
      offset += 4;
    }
  
    return {positions, cells, color};
  }
  
}

{
  const tmp1 = [];
  const tmp2 = [];
  // 侧面
  offset = positions.length;
  for(let i = 1; i < cap.length; i++) {
    const a = [...cap[i], h];
    const b = [...cap[i], -h];
    const nextIdx = i < cap.length - 1 ? i + 1 : 1;
    const c = [...cap[nextIdx], -h];
    const d = [...cap[nextIdx], h];

    positions.push(a, b, c, d);

    const norm = [];
    cross(norm, subtract(tmp1, b, a), subtract(tmp2, c, a));
    normalize(norm, norm);
    normal.push(norm, norm, norm, norm); // abcd四个点共面，它们的法向量相同
    color.push(colorSide, colorSide, colorSide, colorSide);
    cells.push([offset, offset + 1, offset + 2], [offset, offset + 2, offset + 3]);
    offset += 4;
  }

}

```
attribute vec3 a_vertexPosition;
attribute vec4 color;
attribute vec3 normal;

varying vec4 vColor;
varying float vCos;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;

const vec3 lightPosition = vec3(1, 0, 0);

void main() {
  gl_PointSize = 1.0;
  vColor = color;
  vec4 pos =  modelMatrix * vec4(a_vertexPosition, 1.0);
  vec3 invLight = lightPosition - pos.xyz;
  vec3 norm = normalize(normalMatrix * normal);
  vCos = max(dot(normalize(invLight), norm), 0.0);
  gl_Position = projectionMatrix * pos;
}

```