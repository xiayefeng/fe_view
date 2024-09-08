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

// 随机函数
float random (float x) {
  return fract(sin(x * 1243758.5453123));
}

void main() {
  vec2 st = vUv - vec2(0.5);
  st *= 10.0;
  float i = floor(st.x);
  float f = fract(st.x);
  
  // d直接等于随机函数返回值，这样d不连续
  float d = random(i);
  // float d = mix(random(i), random(i + 1.0), f);
  // float d = mix(random(i), random(i + 1.0), smoothstep(0.0, 1.0, f));
  // float d = mix(random(i), random(i + 1.0), f * f * (3.0 - 2.0 * f));
  
  gl_FragColor.rgb = (smoothstep(st.y - 0.05, st.y, d) - smoothstep(st.y, st.y + 0.05, d)) * vec3(1.0);
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

// 二维噪声，对st与方形区域的四个顶点插值
highp float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                    random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                    random( i + vec2(1.0,1.0) ), u.x), u.y);
}

void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(noise(st));
    gl_FragColor.a = 1.0;
}

```

```
void main() {
    vec2 st = mix(vec2(-10, -10), vec2(10, 10), vUv);
    float d = distance(st, vec2(0));
    d *= noise(uTime + st);
    d = smoothstep(0.0, 1.0, d) - step(1.0, d);
    gl_FragColor.rgb = vec3(d);
    gl_FragColor.a = 1.0;
}

```

```
float lines(in vec2 pos, float b){
  float scale = 10.0;
  pos *= scale;
  return smoothstep(0.0, 0.5 + b * 0.5, abs((sin(pos.x * 3.1415) + b * 2.0)) * 0.5);
}

vec2 rotate(vec2 v0, float ang) {
  float sinA = sin(ang);
  float cosA = cos(ang);
  mat3 m = mat3(cosA, -sinA, 0, sinA, cosA, 0, 0, 0, 1);
  return (m * vec3(v0, 1.0)).xy;
}

void main() {
  vec2 st = vUv.yx * vec2(10.0, 3.0);
  st = rotate(st, noise(st));

  float d = lines(st, 0.5);

  gl_FragColor.rgb = 1.0 - vec3(d);
  gl_FragColor.a = 1.0;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

vec2 random2(vec2 st){
  st = vec2( dot(st,vec2(127.1,311.7)),
            dot(st,vec2(269.5,183.3)) );
  return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                  dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
              mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                  dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(0.5 * noise(st) + 0.5);
    gl_FragColor.a = 1.0;
}

```

```
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float noise(vec2 v) {
    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}

void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(0.5 * noise(st) + 0.5);
    gl_FragColor.a = 1.0;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform float uTime;

vec2 random2(vec2 st){
  st = vec2( dot(st,vec2(127.1,311.7)),
            dot(st,vec2(269.5,183.3)) );
  return fract(sin(st) * 43758.5453123);
}

void main() {
  vec2 st = vUv * 10.0;

  float d = 1.0;
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);

  vec2 p = random2(i_st);
  d = distance(f_st, p);
  gl_FragColor.rgb = vec3(d);
  gl_FragColor.a = 1.0;
}

```

```
void main() {
  vec2 st = vUv * 10.0;
  float d = 1.0;
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);

  for(int i = -1; i <= 1; i++) {
    for(int j = -1; j <= 1; j++) {
      vec2 neighbor = vec2(float(i), float(j));
      vec2 p = random2(i_st + neighbor);
      d = min(d, distance(f_st, neighbor + p));
    }
  }

  gl_FragColor.rgb = vec3(d);
  gl_FragColor.a = 1.0;
}

```

```
void main() {
  vec2 st = vUv * 10.0;

  float d = 1.0;
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);

  for(int i = -1; i <= 1; i++) {
    for(int j = -1; j <= 1; j++) {
      vec2 neighbor = vec2(float(i), float(j));
      vec2 p = random2(i_st + neighbor);
      p = 0.5 + 0.5 * sin(uTime + 6.2831 * p);
      d = min(d, distance(f_st, neighbor + p));
    }
  }

  gl_FragColor.rgb = vec3(d) + step(d, 0.03);
  gl_FragColor.a = 1.0;
}

```