async function loadModel(src) {
  const data = await (await fetch(src)).json();

  const geometry = new Geometry(gl, {
    position: {size: 3, data: new Float32Array(data.position)},
    uv: {size: 2, data: new Float32Array(data.uv)},
    normal: {size: 3, data: new Float32Array(data.normal)},
  });

  return geometry;
}

const geometry = await loadModel('../assets/airplane.json');

function loadTexture(src) {
  const texture = new Texture(gl);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      texture.image = img;
      resolve(texture);
    };
    img.src = src;
  });
}

const texture = await loadTexture('../assets/airplane.jpg');

```
precision highp float;

uniform sampler2D tMap;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(tMap, vUv);
}

```

const program = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
    tMap: {value: texture},
  },
});
const mesh = new Mesh(gl, {geometry, program});
mesh.setParent(scene);
renderer.render({scene, camera});


// 更新轴
function updateAxis() {
  const {x, y, z} = palette;
  const v = new Vec3(x, y, z).normalize().scale(10);
  points[1].copy(v);
  axis.updateGeometry();
  renderer.render({scene, camera});
}

// 更新四元数
function updateQuaternion(val) {
  const theta = 0.5 * val / 180 * Math.PI;
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const p = new Vec3().copy(points[1]).normalize();
  const q = new Quat(p.x * s, p.y * s, p.z * s, c);
  mesh.quaternion = q;
  renderer.render({scene, camera});
}


const points = [
  new Vec3(0, 0, 0),
  new Vec3(0, 10, 0),
];

const axis = new Polyline(gl, {
  points,
  uniforms: {
    uColor: {value: new Color('#f00')},
    uThickness: {value: 3},
  },
});
axis.mesh.setParent(scene);



