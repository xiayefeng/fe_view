function randomTriangle(x = 0, y = 0, rotation = 0.0, radius = 0.1) {
  const a = rotation,
    b = a + 2 * Math.PI / 3,
    c = a + 4 * Math.PI / 3;

  return [
    [x + radius * Math.sin(a), y + radius * Math.cos(a)],
    [x + radius * Math.sin(b), y + radius * Math.cos(b)],
    [x + radius * Math.sin(c), y + radius * Math.cos(c)],
  ];
}

const COUNT = 3000;
function render() {
  for(let i = 0; i < COUNT; i++) {
    const x = 2 * Math.random() - 1;
    const y = 2 * Math.random() - 1;
    const rotation = 2 * Math.PI * Math.random();
 
    renderer.uniforms.u_color = [
      Math.random(),
      Math.random(),
      Math.random(),
      1];

    const positions = randomTriangle(x, y, rotation);
    renderer.setMeshData([{
      positions,
    }]);

    renderer._draw();
  }
  requestAnimationFrame(render);
}

render();

```
// 顶点着色器
attribute vec2 a_vertexPosition;

void main() {
  gl_Position = vec4(a_vertexPosition, 1, 1);
}

// 片元着色器
#ifdef GL_ES
precision highp float;
#endif

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}

```

// to be 

const alpha = 2 * Math.PI / 3;
const beta = 2 * alpha;

renderer.setMeshData({
  positions: [
    [0, 0.1],
    [0.1 * Math.sin(alpha), 0.1 * Math.cos(alpha)],
    [0.1 * Math.sin(beta), 0.1 * Math.cos(beta)],
  ],
});

/* const COUNT = 3000;
function render() {
  for(let i = 0; i < COUNT; i++) {
    const x = 2 * Math.random() - 1;
    const y = 2 * Math.random() - 1;
    const rotation = 2 * Math.PI * Math.random();

    renderer.uniforms.modelMatrix = [
      Math.cos(rotation), -Math.sin(rotation), 0,
      Math.sin(rotation), Math.cos(rotation), 0,
      x, y, 1,
    ];

    renderer.uniforms.u_color = [
      Math.random(),
      Math.random(),
      Math.random(),
      1];

    renderer._draw();
  }
  requestAnimationFrame(render);
}

render(); */

```
attribute vec2 a_vertexPosition;

uniform mat3 modelMatrix;

void main() {
  vec3 pos = modelMatrix * vec3(a_vertexPosition, 1);
  gl_Position = vec4(pos, 1);
}

```

// 静态批量绘制（多实例绘

/* const alpha = 2 * Math.PI / 3;
const beta = 2 * alpha;

const COUNT = 3000;
renderer.setMeshData({
  positions: [
    [0, 0.1],
    [0.1 * Math.sin(alpha), 0.1 * Math.cos(alpha)],
    [0.1 * Math.sin(beta), 0.1 * Math.cos(beta)],
  ],
  instanceCount: COUNT,
  attributes: {
    id: {data: [...new Array(COUNT).keys()], divisor: 1},
  },
}); 

function render(t) {
  renderer.uniforms.uTime = t;
  renderer.render();
  requestAnimationFrame(render);
}

render(0);

*/

```
attribute vec2 a_vertexPosition;
attribute float id;

uniform float uTime;

highp float random(vec2 co) {
  highp float a = 12.9898;
  highp float b = 78.233;
  highp float c = 43758.5453;
  highp float dt= dot(co.xy ,vec2(a,b));
  highp float sn= mod(dt,3.14);
  return fract(sin(sn) * c);
}

varying vec3 vColor;

void main() {
  float t = id / 10000.0;
  float alpha = 6.28 * random(vec2(uTime, 2.0 + t));
  float c = cos(alpha);
  float s = sin(alpha);

  mat3 modelMatrix = mat3(
    c, -s, 0,
    s, c, 0,
    2.0 * random(vec2(uTime, t)) - 1.0, 2.0 * random(vec2(uTime, 1.0 + t)) - 1.0, 1
  );
  vec3 pos = modelMatrix * vec3(a_vertexPosition, 1);
  vColor = vec3(
    random(vec2(uTime, 4.0 + t)),
    random(vec2(uTime, 5.0 + t)),
    random(vec2(uTime, 6.0 + t))
  );
  gl_Position = vec4(pos, 1);
}

```


function randomShape(x = 0, y = 0, edges = 3, rotation = 0.0, radius = 0.1) {
  const a0 = rotation;
  const delta = 2 * Math.PI / edges;
  const positions = [];
  const cells = [];
  for(let i = 0; i < edges; i++) {
    const angle = a0 + i * delta;
    positions.push([x + radius * Math.sin(angle), y + radius * Math.cos(angle)]);
    if(i > 0 && i < edges - 1) {
      cells.push([0, i, i + 1]);
    }
  }
  return {positions, cells};
}

const {positions, cells} = randomShape(x, y, 3 + Math.floor(4 * Math.random()), rotation);
renderer.setMeshData([{
  positions,
  cells,
}]);

function createShapes(count) {
  const positions = new Float32Array(count * 6 * 3); // 最多6边形
  const cells = new Int16Array(count * 4 * 3); // 索引数等于3倍顶点数-2

  let offset = 0;
  let cellsOffset = 0;
  for(let i = 0; i < count; i++) {
    const edges = 3 + Math.floor(4 * Math.random());
    const delta = 2 * Math.PI / edges;

    for(let j = 0; j < edges; j++) {
      const angle = j * delta;
      positions.set([0.1 * Math.sin(angle), 0.1 * Math.cos(angle), i], (offset + j) * 3);
      if(j > 0 && j < edges - 1) {
        cells.set([offset, offset + j, offset + j + 1], cellsOffset);
        cellsOffset += 3;
      }
    }
    offset += edges;
  }
  return {positions, cells};
}

/* const {positions, cells} = createShapes(COUNT);

renderer.setMeshData([{
  positions,
  cells,
}]);

function render(t) {
  renderer.uniforms.uTime = t;
  renderer.render();
  requestAnimationFrame(render);
}

render(0); */

```
attribute vec3 a_vertexPosition;
uniform float uTime;

highp float random(vec2 co) {
  highp float a = 12.9898;
  highp float b = 78.233;
  highp float c = 43758.5453;
  highp float dt= dot(co.xy ,vec2(a,b));
  highp float sn= mod(dt,3.14);
  return fract(sin(sn) * c);
}

varying vec3 vColor;

void main() {
  vec2 pos = a_vertexPosition.xy;
  float t = a_vertexPosition.z / 10000.0;

  float alpha = 6.28 * random(vec2(uTime, 2.0 + t));
  float c = cos(alpha);
  float s = sin(alpha);

  mat3 modelMatrix = mat3(
    c, -s, 0,
    s, c, 0,
    2.0 * random(vec2(uTime, t)) - 1.0, 2.0 * random(vec2(uTime, 1.0 + t)) - 1.0, 1
  );
  vColor = vec3(
    random(vec2(uTime, 4.0 + t)),
    random(vec2(uTime, 5.0 + t)),
    random(vec2(uTime, 6.0 + t))
  );
  gl_Position = vec4(modelMatrix * vec3(pos, 1), 1);
}

```