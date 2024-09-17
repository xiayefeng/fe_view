function updateCamera(eye, target = [0, 0, 0]) {
  const [x, y, z] = eye;
  const m = new Mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1,
  );
  const up = [0, 1, 0];
  m.lookAt(eye, target, up).inverse();
  renderer.uniforms.viewMatrix = m;
}

```
 attribute vec3 a_vertexPosition;
  attribute vec4 color;
  attribute vec3 normal;

  varying vec4 vColor;
  varying float vCos;
  uniform mat4 projectionMatrix;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat3 normalMatrix;
  
  const vec3 lightPosition = vec3(1, 0, 0);

  void main() {
    gl_PointSize = 1.0;
    vColor = color;
    vec4 pos = viewMatrix * modelMatrix * vec4(a_vertexPosition, 1.0);
    vec4 lp = viewMatrix * vec4(lightPosition, 1.0);
    vec3 invLight = lp.xyz - pos.xyz;
    vec3 norm = normalize(normalMatrix * normal);
    vCos = max(dot(normalize(invLight), norm), 0.0);
    gl_Position = projectionMatrix * pos;
  }

```

{

  function update() {
    const modelMatrix = fromRotation(rotationX, rotationY, rotationZ);
    modelMatrix[12] = 0.5; // 给 x 轴增加 0.5 的平移
    modelMatrix[13] = 0.5; // 给 y 轴也增加 0.5 的平移
    renderer.uniforms.modelMatrix = modelMatrix;
    renderer.uniforms.normalMatrix = normalFromMat4([], modelMatrix);
    // ...
  }

  // 计算正投影矩阵
function ortho(out, left, right, bottom, top, near, far) {
  let lr = 1 / (left - right);
  let bt = 1 / (bottom - top);
  let nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}

// 计算透视投影矩阵
function perspective(out, fovy, aspect, near, far) {
  let f = 1.0 / Math.tan(fovy / 2);
  let nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;
  return out;
}

// import {ortho} from '../common/lib/math/functions/Mat4Func.js';
function projection(left, right, bottom, top, near, far) {
  return ortho([], left, right, bottom, top, near, far);
}

const projectionMatrix = projection(-2, 2, -2, 2, -2, 2);
renderer.uniforms.projectionMatrix = projectionMatrix; // 投影矩阵 

updateCamera([0.5, 0, 0.5]); // 设置相机位置

  
}

{

 // import {perspective} from '../common/lib/math/functions/Mat4Func.js';

function projection(near = 0.1, far = 100, fov = 45, aspect = 1) {
  return perspective([], fov * Math.PI / 180, aspect, near, far);
}

const projectionMatrix = projection();
renderer.uniforms.projectionMatrix = projectionMatrix;

updateCamera([2, 2, 3]); // 设置相机位置

}

{
  // OGL https://github.com/oframe/ogl
  const canvas = document.querySelector('canvas');
const renderer = new Renderer({
  canvas,
  width: 512,
  height: 512,
});

const gl = renderer.gl;
gl.clearColor(1, 1, 1, 1);
const camera = new Camera(gl, {fov: 35});
camera.position.set(0, 1, 7);
camera.lookAt([0, 0, 0]);


const scene = new Transform();

const sphereGeometry = new Sphere(gl);
const cubeGeometry = new Box(gl);
const cylinderGeometry = new Cylinder(gl);
const torusGeometry = new Torus(gl);


}


const vertex = /* glsl */ `
  precision highp float;

  attribute vec3 position;
  attribute vec3 normal;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  varying vec3 vNormal;
  void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  varying vec3 vNormal;
  void main() {
      vec3 normal = normalize(vNormal);
      float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
      gl_FragColor.rgb = vec3(0.2, 0.8, 1.0) + lighting * 0.1;
      gl_FragColor.a = 1.0;
  }
`;

const program = new Program(gl, {
  vertex,
  fragment,
});

const torus = new Mesh(gl, {geometry: torusGeometry, program});
torus.position.set(0, 1.3, 0);
torus.setParent(scene);

const sphere = new Mesh(gl, {geometry: sphereGeometry, program});
sphere.position.set(1.3, 0, 0);
sphere.setParent(scene);

const cube = new Mesh(gl, {geometry: cubeGeometry, program});
cube.position.set(0, -1.3, 0);
cube.setParent(scene);

const cylinder = new Mesh(gl, {geometry: cylinderGeometry, program});
cylinder.position.set(-1.3, 0, 0);
cylinder.setParent(scene);

requestAnimationFrame(update);
function update() {
  requestAnimationFrame(update);

  torus.rotation.y -= 0.02;
  sphere.rotation.y -= 0.03;
  cube.rotation.y -= 0.04;
  cylinder.rotation.y -= 0.02;

  renderer.render({scene, camera});
}


