```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform sampler2D tMap;
uniform float fWidth;
uniform vec2 vFrames[3];
uniform int frameIndex;

void main() {
  vec2 uv = vUv;
  for (int i = 0; i < 3; i++) {
    uv.x = mix(vFrames[i].x, vFrames[i].y, vUv.x) / fWidth;
    if(float(i) == mod(float(frameIndex), 3.0)) break;
  }
  vec4 color = texture2D(tMap, uv);
  gl_FragColor = color;
}

```

const canvas = document.querySelector('canvas');
const renderer = new GlRenderer(canvas);
const textureURL = 'https://p.ssl.qhimg.com/t01f265b6b6479fffc4.png';
(async function () {
  const texture = await renderer.loadTexture(textureURL);
  const program = renderer.compileSync(fragment, vertex);
  renderer.useProgram(program);
  renderer.uniforms.tMap = texture;
  renderer.uniforms.fWidth = 272;
  renderer.uniforms.vFrames = [2, 88, 90, 176, 178, 264];
  renderer.uniforms.frameIndex = 0;
  setInterval(() => {
    renderer.uniforms.frameIndex++;
  }, 200);
  const x = 43 / canvas.width;
  const y = 30 / canvas.height;
  renderer.setMeshData([{
    positions: [
      [-x, -y],
      [-x, y],
      [x, y],
      [x, -y],
    ],
    attributes: {
      uv: [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
      ],
    },
    cells: [[0, 1, 2], [2, 0, 3]],
  }]);
  renderer.render();
}());

```
attribute vec2 a_vertexPosition;
attribute vec2 uv;

varying vec2 vUv;
uniform float rotation;

void main() {
  gl_PointSize = 1.0;
  vUv = uv;
  float c = cos(rotation);
  float s = sin(rotation);
  mat3 transformMatrix = mat3(
    c, s, 0,
    -s, c, 0,
    0, 0, 1
  );
  vec3 pos = transformMatrix * vec3(a_vertexPosition, 1);
  gl_Position = vec4(pos, 1);
}

```

renderer.uniforms.rotation = 0.0;

requestAnimationFrame(function update() {
  renderer.uniforms.rotation += 0.05;
  requestAnimationFrame(update);
});

const animator = new Animator({duration: 2000, iterations: Infinity});
animator.animate(renderer, ({target, timing}) => {
  target.uniforms.rotation = timing.p * 2 * Math.PI;
});


```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform vec4 color;
uniform float rotation;

void main() {
  vec2 st = 2.0 * (vUv - vec2(0.5));
  float c = cos(rotation);
  float s = sin(rotation);
  mat3 transformMatrix = mat3(
    c, s, 0,
    -s, c, 0,
    0, 0, 1
  );
  vec3 pos = transformMatrix * vec3(st, 1.0);
  float d1 = 1.0 - smoothstep(0.5, 0.505, abs(pos.x));
  float d2 = 1.0 - smoothstep(0.5, 0.505, abs(pos.y));
  gl_FragColor = d1 * d2 * color;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform float rotation;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))*
        43758.5453123);
}

vec3 hsb2rgb(vec3 c){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
  vec2 f_uv = fract(vUv * 10.0);
  vec2 i_uv = floor(vUv * 10.0);
  vec2 st = 2.0 * (f_uv - vec2(0.5));
  float c = 0.7 * cos(rotation);
  float s = 0.7 * sin(rotation);
  mat3 transformMatrix = mat3(
    c, s, 0,
    -s, c, 0,
    0, 0, 1
  );
  vec3 pos = transformMatrix * vec3(st, 1.0);
  float d1 = 1.0 - smoothstep(0.5, 0.505, abs(pos.x));
  float d2 = 1.0 - smoothstep(0.5, 0.505, abs(pos.y));
  gl_FragColor = d1 * d2 * vec4(hsb2rgb(vec3(random(i_uv), 1.0, 1.0)), 1.0);
}

```

```
attribute vec2 a_vertexPosition;
attribute vec2 uv;

varying vec2 vUv;
uniform vec2 translation;

void main() {
  gl_PointSize = 1.0;
  vUv = uv;
  mat3 transformMatrix = mat3(
    1, 0, 0,
    0, 1, 0,
    translation, 1
  );
  vec3 pos = transformMatrix * vec3(a_vertexPosition, 1);
  gl_Position = vec4(pos, 1);
}



```

{
  const canvas = document.querySelector('canvas');
const renderer = new GlRenderer(canvas);
const program = renderer.compileSync(fragment, vertex);
renderer.useProgram(program);
renderer.uniforms.color = [1, 0, 0, 1];
renderer.uniforms.translation = [-0.5, 0];

const animator = new Animator({duration: 2000});
animator.animate(renderer, ({target, timing}) => {
  target.uniforms.translation = [-0.5 * (1 - timing.p) + 0.5 * timing.p, 0];
});

renderer.setMeshData([{
  positions: [
    [-0.25, -0.25],
    [-0.25, 0.25],
    [0.25, 0.25],
    [0.25, -0.25],
  ],
  attributes: {
    uv: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ],
  },
  cells: [[0, 1, 2], [2, 0, 3]],
}]);
renderer.render();


}

```
attribute vec2 a_vertexPosition;
attribute vec2 uv;

varying vec2 vUv;
uniform vec4 uFromTo;
uniform float uTime;

float easing(in float p) {
  return smoothstep(0.0, 1.0, p);
  // return clamp(p * p, 0.0, 1.0);
  // return clamp(p * (2 - p) * 0.0, 1.0);
}

void main() {
  gl_PointSize = 1.0;
  vUv = uv;
  vec2 from = uFromTo.xy;
  vec2 to = uFromTo.zw;
  float p = easing(uTime / 2.0);
  vec2 translation = mix(from, to, p);
  mat3 transformMatrix = mat3(
    1, 0, 0,
    0, 1, 0,
    translation, 1
  );
  vec3 pos = transformMatrix * vec3(a_vertexPosition, 1);
  gl_Position = vec4(pos, 1);
}

```

```
//顶点着色器
attribute vec2 a_vertexPosition;
attribute vec2 uv;
attribute vec4 color;

varying vec2 vUv;
varying vec4 vColor;
uniform vec4 uFromTo;
uniform float uTime;

void main() {
  gl_PointSize = 1.0;
  vUv = uv;
  vColor = color;
  gl_Position = vec4(a_vertexPosition, 1, 1);
}

//片元着色器

#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}

//JavaScript中的代码
renderer.setMeshData([{
  positions: [
    [-0.5, -0.25],
    [-0.5, 0.25],
    [0.5, 0.25],
    [0.5, -0.25],
  ],
  attributes: {
    uv: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    color: [
      [1, 0, 0, 1],
      [1, 0, 0, 1],
      [0, 0.5, 0, 1],
      [0, 0.5, 0, 1],
    ],
  },
  cells: [[0, 1, 2], [2, 0, 3]],
}]);
renderer.render();

```

```
// http://www.flong.com/texts/code/shapers_bez/
// Helper functions:
float slope_from_t (float t, float A, float B, float C){
  float dtdx = 1.0/(3.0*A*t*t + 2.0*B*t + C); 
  return dtdx;
}

float x_from_t (float t, float A, float B, float C, float D){
  float x = A*(t*t*t) + B*(t*t) + C*t + D;
  return x;
}

float y_from_t (float t, float E, float F, float G, float H){
  float y = E*(t*t*t) + F*(t*t) + G*t + H;
  return y;
}

float cubic_bezier (float x, float a, float b, float c, float d){
  float y0a = 0.00; // initial y
  float x0a = 0.00; // initial x 
  float y1a = b;    // 1st influence y   
  float x1a = a;    // 1st influence x 
  float y2a = d;    // 2nd influence y
  float x2a = c;    // 2nd influence x
  float y3a = 1.00; // final y 
  float x3a = 1.00; // final x 

  float A = x3a - 3.0 *x2a + 3.0 * x1a - x0a;
  float B = 3.0 * x2a - 6.0 * x1a + 3.0 * x0a;
  float C = 3.0 * x1a - 3.0 * x0a;   
  float D = x0a;

  float E = y3a - 3.0 * y2a + 3.0 * y1a - y0a;    
  float F = 3.0 * y2a - 6.0 * y1a + 3.0 * y0a;             
  float G = 3.0 * y1a - 3.0 * y0a;             
  float H = y0a;

  // Solve for t given x (using Newton-Raphelson), then solve for y given t.
  // Assume for the first guess that t = x.
  float currentt = x;
  const int nRefinementIterations = 5;
  for (int i=0; i < nRefinementIterations; i++){
    float currentx = x_from_t(currentt, A,B,C,D); 
    float currentslope = slope_from_t(currentt, A,B,C);
    currentt -= (currentx - x)*(currentslope);
    currentt = clamp(currentt, 0.0, 1.0);
  } 

  float y = y_from_t(currentt, E,F,G,H);
  return y;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

...

float sdf_circle(vec2 st, vec2 c, float r) {
  return 1.0 - length(st - c) / r;
}

varying vec2 vUv;
uniform float uTime;

void main() {
  vec2 st = vUv;
  float rx = mix(-0.2, 0.2, noise(vec2(7881.32, 0) + random(st) + uTime));
  float ry = mix(-0.2, 0.2, noise(vec2(0, 1433.59) + random(st) + uTime));
  float dis = distance(st, vec2(0.5));
  dis = pow((1.0 - dis), 2.0);
  float d = sdf_circle(st + vec2(rx, ry), vec2(0.5), 0.2);
  d = smoothstep(0.0, 0.1, d);
  gl_FragColor = vec4(dis * d * vec3(1.0), 1.0);
}

```