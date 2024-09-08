```
//顶点着色器:

attribute vec2 a_vertexPosition;
attribute vec2 uv;
varying vec2 vUv;


void main() {
  gl_PointSize = 1.0;
  vUv = uv;
  gl_Position = vec4(a_vertexPosition, 1, 1);


//片元着色器:


#ifdef GL_ES
precision mediump float;
#endif
varying vec2 vUv;
uniform float rows;

void main() {
  vec2 st = fract(vUv * rows);
  float d1 = step(st.x, 0.9);
  float d2 = step(0.1, st.y);
  gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1 * d2);
  gl_FragColor.a = 1.0;
}


```

//第一步:
const canvas = document.querySelector('canvas');
const renderer = new GlRenderer(canvas);

//第二步:
const program = renderer.compileSync(fragment, vertex);
renderer.useProgram(program);

// 第三步:
renderer.uniforms.rows = 64;

// 第四步:

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


```
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 vUv;
uniform vec2 center;
uniform float scale;

vec2 f(vec2 z, vec2 c) {
  return mat2(z, -z.y, z.x) * z + c;
}

void main() {
    vec2 uv = vUv;
    vec2 c = center + 4.0 * (uv - vec2(0.5)) / scale;
    vec2 z = vec2(0.0);

    bool escaped = false;
    int j;
    for (int i = 0; i < 65536; i++) {
      if(i > iterations) break;
      j = i;
      z = f(z, c);
      if (length(z) > 2.0) {
        escaped = true;
        break;
      }
    }

    gl_FragColor.rgb = escaped ? vec3(float(j)) / float(iterations) : vec3(0.0);
    gl_FragColor.a = 1.0;
}

```

const program2 = renderer.compileSync(fragment, vertex);
renderer.useProgram(program2);
renderer.uniforms.center = [0, 0];
renderer.uniforms.scale = 1;
renderer.uniforms.iterations = 256;

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
float random (vec2 st) {
  return fract(sin(dot(st.xy,
                       vec2(12.9898,78.233)))*
      43758.5453123);
}
```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    gl_FragColor.rgb = vec3(random(vUv));
    gl_FragColor.a = 1.0;
}

```

```
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  float random (vec2 st) {
      return fract(sin(dot(st.xy,
                          vec2(12.9898,78.233)))*
          43758.5453123);
  }

  void main() {
      vec2 st = vUv * 10.0;
      gl_FragColor.rgb = vec3(random(floor(st)));
      gl_FragColor.a = 1.0;
  }

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

uniform float uTime;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec2 st = vUv * vec2(100.0, 50.0);

    st.x -= (1.0 + 10.0 * random(vec2(floor(st.y)))) * uTime;

    vec2 ipos = floor(st);  // integer
    vec2 fpos = fract(st);  // fraction

    vec3 color = vec3(step(random(ipos), 0.7));
    color *= step(0.2,fpos.y);

    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
}

```

```
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

varying vec2 vUv;
uniform vec2 u_resolution;
uniform int rows;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                        vec2(12.9898,78.233)))*
        43758.5453123);
}

vec2 truchetPattern(in vec2 _st, in float _index){
    _index = fract(((_index-0.5)*2.0));
    if (_index > 0.75) {
        _st = vec2(1.0) - _st;
    } else if (_index > 0.5) {
        _st = vec2(1.0-_st.x,_st.y);
    } else if (_index > 0.25) {
        _st = 1.0-vec2(1.0-_st.x,_st.y);
    }
    return _st;
}

void main() {
    vec2 st = vUv * float(rows);
    vec2 ipos = floor(st);  // integer
    vec2 fpos = fract(st);  // fraction

    vec2 tile = truchetPattern(fpos, random( ipos ));
    float color = 0.0;

    color = smoothstep(tile.x-0.3,tile.x,tile.y)-
            smoothstep(tile.x,tile.x+0.3,tile.y);

    gl_FragColor = vec4(vec3(color),1.0);
}

```


