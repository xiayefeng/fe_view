const canvas = document.querySelector('canvas');
const renderer = new GlRenderer(canvas);

const vertex = `
  attribute vec2 a_vertexPosition;
  attribute vec4 color;
  attribute float bias;

  uniform float uTime;
  uniform vec2 uResolution;

  varying vec4 vColor;
  varying vec2 vPos;
  varying vec2 vResolution;
  varying float vScale;

  void main() {
    float scale = 0.7 + 0.3 * sin(6.28 * bias + 0.003 * uTime);
    gl_PointSize = 0.05 * uResolution.x * scale;
    vColor = color;
    vPos = a_vertexPosition;
    vResolution = uResolution;
    vScale = scale;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`;


const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec4 vColor;
  varying vec2 vPos;
  varying vec2 vResolution;
  varying float vScale;
  
  void main() {
    vec2 st = gl_FragCoord.xy / vResolution;
    st = 2.0 * st - vec2(1);
    float d = step(distance(vPos, st), 0.05 * vScale);
    gl_FragColor = d * vColor;
  }
`;
const program = renderer.compileSync(fragment, vertex);
renderer.useProgram(program);

const COUNT = 200000;
function init() {
  const colors = [];
  const pos = [];
  const bias = [];
  for(let i = 0; i < COUNT; i++) {
    const x = 2 * Math.random() - 1;
    const y = 2 * Math.random() - 1;
    const rotation = 2 * Math.PI * Math.random();

    colors.push([
      Math.random(),
      Math.random(),
      Math.random(),
      1
    ]);

    pos.push([
      2 * Math.random() - 1,
      2 * Math.random() - 1
    ]);

    bias.push(
      Math.random()
    );
  }

  renderer.uniforms.uTime = 0;
  renderer.uniforms.uResolution = [canvas.width, canvas.height];

  renderer.setMeshData({
    mode: renderer.gl.POINTS,
    enableBlend: true,
    positions: pos,
    attributes: {
      color: {data: [...colors]},
      bias: {data: [...bias]},
    },
  });
}
init();


function update(t) {
  renderer.uniforms.uTime = t;
  renderer.render();
  requestAnimationFrame(update);
}

update(0);
