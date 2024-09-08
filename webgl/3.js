```
// 纯黑色

#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(0, 0, 0, 1);
}

```

```
// 左到右由黑向白过渡

#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

void main() {
  gl_FragColor.rgb = vec3(vUv.x);
  gl_FragColor.a = 1.0;
}

```

```

#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

void main() {
  vec2 st = vUv * 10.0;
  gl_FragColor.rgb = vec3(fract(st), 0.0);
  gl_FragColor.a = 1.0;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

void main() {
  vec2 st = vUv * 10.0;
  vec2 idx = floor(st);
  vec2 grid = fract(st);

  vec2 t = mod(idx, 2.0);
  
  if(t.x == 1.0) {
    grid.x = 1.0 - grid.x;
  }
  if(t.y == 1.0) {
    grid.y = 1.0 - grid.y;
  }
  gl_FragColor.rgb = vec3(grid, 0.0);
  gl_FragColor.a = 1.0;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

void main() {
  float d = distance(vUv, vec2(0.5));
  gl_FragColor.rgb = d * vec3(1.0);
  gl_FragColor.a = 1.0;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

void main() {
  float d = distance(vUv, vec2(0.5));
  gl_FragColor.rgb = step(d, 0.2) * vec3(1.0);
  gl_FragColor.a = 1.0;
}


```

```
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D tMap;
uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec2 uv = vUv;
    uv.y *= uResolution.y / uResolution.x;
    vec2 st = uv * 100.0;
    float d = distance(fract(st), vec2(0.5));
    float p = uTime + random(floor(st));
    float shading = 0.5 + 0.5 * sin(p);
    d = smoothstep(d, d + 0.01, 1.0 * shading);
    vec4 color = texture2D(tMap, vUv);
    gl_FragColor.rgb = color.rgb * clamp(0.5, 1.3, d + 1.0 * shading);
    gl_FragColor.a = color.a;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

void main() {
  vec3 line = vec3(1, 1, 0);
  float d = abs(cross(vec3(vUv,0), normalize(line)).z); 
  gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
  gl_FragColor.a = 1.0;
}

```

```
const canvas = document.querySelector('canvas');
const renderer = new GlRenderer(canvas);
const program = renderer.compileSync(fragment, vertex);
renderer.useProgram(program);

renderer.uniforms.uMouse = [-1, -1];

canvas.addEventListener('mousemove', (e) => {
  const {x, y, width, height} = e.target.getBoundingClientRect();
  renderer.uniforms.uMouse = [
    (e.x - x) / width,
    1.0 - (e.y - y) / height,
  ];
});

renderer.setMeshData([{
  positions: [
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, -1],
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

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform vec2 uMouse;
uniform vec2 uOrigin;

void main() {
  vec3 line = vec3(uMouse - uOrigin, 0); // 用向量表示所在直线
  float d = abs(cross(vec3(vUv - uOrigin, 0), normalize(line)).z); // 叉乘表示平行四边形面积，底边为1，得到距离
  gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
  gl_FragColor.a = 1.0;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform vec2 uMouse;
uniform vec2 uOrigin;

float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
  vec3 ab = vec3(b - a, 0);
  vec3 p = vec3(st - a, 0);
  float l = length(ab);
  float d = abs(cross(p, normalize(ab)).z);
  float proj = dot(p, ab) / l;
  if(proj >= 0.0 && proj <= l) return d;
  return min(distance(st, a), distance(st, b));
}

void main() {
  float d = seg_distance(vUv, uOrigin, uMouse);
  gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
  gl_FragColor.a = 1.0;
}

```

```
// 绘制三角形
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

float line_distance(in vec2 st, in vec2 a, in vec2 b) {
  vec3 ab = vec3(b - a, 0);
  vec3 p = vec3(st - a, 0);
  float l = length(ab);
  return cross(p, normalize(ab)).z;
}

float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
  vec3 ab = vec3(b - a, 0);
  vec3 p = vec3(st - a, 0);
  float l = length(ab);
  float d = abs(cross(p, normalize(ab)).z);
  float proj = dot(p, ab) / l;
  if(proj >= 0.0 && proj <= l) return d;
  return min(distance(st, a), distance(st, b));
}

float triangle_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c) {
  float d1 = line_distance(st, a, b);
  float d2 = line_distance(st, b, c);
  float d3 = line_distance(st, c, a);

  if(d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0 || d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0) {
    return -min(abs(d1), min(abs(d2), abs(d3))); // 内部距离为负
  }
  
  return min(seg_distance(st, a, b), min(seg_distance(st, b, c), seg_distance(st, c, a))); // 外部为正
}

void main() {
  float d = triangle_distance(vUv, vec2(0.3), vec2(0.5, 0.7), vec2(0.7, 0.3));
  gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
  gl_FragColor.a = 1.0;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

void main() {
  vec3 line = vec3(1, 1, 0);
  float d = abs(cross(vec3(vUv,0), normalize(line)).z);
  gl_FragColor.rgb = (smoothstep(0.195, 0.2, d) - smoothstep(0.2, 0.205, d)) * vec3(1.0);
  gl_FragColor.a = 1.0;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

void main() {
  vec3 line = vec3(1, 1, 0);
  float d = abs(cross(vec3(vUv,0), normalize(line)).z);
  d = fract(20.0 * d);
  gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
  gl_FragColor.a = 1.0;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

void main() {
  float d = distance(vUv, vec2(0.5));
  d = fract(20.0 * d);
  gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
  gl_FragColor.a = 1.0;
}

```


```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

float line_distance(in vec2 st, in vec2 a, in vec2 b) {
  vec3 ab = vec3(b - a, 0);
  vec3 p = vec3(st - a, 0);
  float l = length(ab);
  return cross(p, normalize(ab)).z;
}

float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
  vec3 ab = vec3(b - a, 0);
  vec3 p = vec3(st - a, 0);
  float l = length(ab);
  float d = abs(cross(p, normalize(ab)).z);
  float proj = dot(p, ab) / l;
  if(proj >= 0.0 && proj <= l) return d;
  return min(distance(st, a), distance(st, b));
}

float triangle_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c) {
  float d1 = line_distance(st, a, b);
  float d2 = line_distance(st, b, c);
  float d3 = line_distance(st, c, a);

  if(d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0 || d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0) {
    return -min(abs(d1), min(abs(d2), abs(d3))); // 内部距离为负
  }
  
  return min(seg_distance(st, a, b), min(seg_distance(st, b, c), seg_distance(st, c, a))); // 外部为正
}

void main() {
  float d = triangle_distance(vUv, vec2(0.3), vec2(0.5, 0.7), vec2(0.7, 0.3));
  d = fract(20.0 * abs(d));
  gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
  gl_FragColor.a = 1.0;
}

```

```
void main() {
  float d = triangle_distance(vUv, vec2(0.3), vec2(0.5, 0.7), vec2(0.7, 0.3));
  d = fract(20.0 * abs(d));
  gl_FragColor.rgb = vec3(d);
  // gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
  gl_FragColor.a = 1.0;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

uniform sampler2D tMap;
uniform float uTime;

...

void main() {
  vec4 color = texture2D(tMap, vUv);
  vec2 uv = vUv - vec2(0.5);
  vec2 a = vec2(-0.577, 0) - vec2(0.5);
  vec2 b = vec2(0.5, 1.866) - vec2(0.5);
  vec2 c = vec2(1.577, 0) - vec2(0.5);

  float scale = min(1.0, 0.0005 * uTime);
    float d = triangle_distance(uv, scale * a, scale * b, scale * c);
    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * color.rgb;
    gl_FragColor.a = 1.0;
  }

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

uniform sampler2D tMap;
uniform float uTime;

...

void main() {
  vec4 color = texture2D(tMap, vUv);
  vec2 uv = vUv - vec2(0.5);
  vec2 a = vec2(0, 1);
  float time = 0.0005 * uTime;

  vec2 b = vec2(sin(time), cos(time));
  float d = 0.0;

  float c0 = cross(vec3(b, 0.0), vec3(a, 0.0)).z;
  float c1 = cross(vec3(uv, 0.0), vec3(a, 0.0)).z;
  float c2 = cross(vec3(uv, 0.0), vec3(b, 0.0)).z;
  if(c0 > 0.0 && c1 > 0.0 && c2 < 0.0) {
    d = 1.0;
  }
  if(c0 < 0.0 && (c1 >= 0.0 || c2 <= 0.0)) {
    d = 1.0;
  }

  gl_FragColor.rgb = color.rgb;
  gl_FragColor.r *= mix(0.3, 1.0, d);
  gl_FragColor.a = mix(0.9, 1.0, d);
}


```