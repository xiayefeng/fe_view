```
#ifdef GL_ES
precision highp float;
#endif

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

varying vec2 vUv;

void main() {
  vec2 st = vUv;
  st *= 10.0;
  vec2 i_st = floor(st);
  vec2 f_st = 2.0 * fract(st) - vec2(1);
  float r = random(i_st);
  float sign = 2.0 * step(0.5, r) - 1.0;
  
  float d = triangle_distance(f_st, vec2(-1), vec2(1), sign * vec2(1, -1));
  gl_FragColor.rgb = (smoothstep(-0.85, -0.8, d) - smoothstep(0.0, 0.05, d)) * hsb2rgb(vec3(r + 1.2, 0.5, r));
  gl_FragColor.a = 1.0;
}

```

```
...

renderer.useProgram(program);

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

const fbo = renderer.createFBO();
renderer.bindFBO(fbo);
renderer.render();
renderer.bindFBO(null);

const blurProgram = renderer.compileSync(blurFragment, vertex);
renderer.useProgram(blurProgram);
renderer.setMeshData(program.meshData);
renderer.uniforms.tMap = fbo.texture;
renderer.render();

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform sampler2D tMap;
uniform int axis;

void main() {
  vec4 color = texture2D(tMap, vUv);

  // 高斯矩阵的权重值
  float weight[5];
  weight[0] = 0.227027;
  weight[1] = 0.1945946;
  weight[2] = 0.1216216;
  weight[3] = 0.054054;
  weight[4] = 0.016216;

  // 每一个相邻像素的坐标间隔，这里的512可以用实际的Canvas像素宽代替
  float tex_offset = 1.0 / 512.0;

  vec3 result = color.rgb;
  result *= weight[0];
  for(int i = 1; i < 5; ++i) {
    float f = float(i);
    if(axis == 0) { // x轴的高斯模糊
      result += texture2D(tMap, vUv + vec2(tex_offset * f, 0.0)).rgb * weight[i];
      result += texture2D(tMap, vUv - vec2(tex_offset * f, 0.0)).rgb * weight[i];
    } else { // y轴的高斯模糊
      result += texture2D(tMap, vUv + vec2(0.0, tex_offset * f)).rgb * weight[i];
      result += texture2D(tMap, vUv - vec2(0.0, tex_offset * f)).rgb * weight[i];
    }
  }

  gl_FragColor.rgb = result.rgb;
  gl_FragColor.a = color.a;
}


```


```
// 创建两个FBO对象交替使用
const fbo1 = renderer.createFBO();
const fbo2 = renderer.createFBO();

// 第一次，渲染原始图形
renderer.bindFBO(fbo1);
renderer.render();

// 第二次，对x轴高斯模糊
renderer.useProgram(blurProgram);
renderer.setMeshData(program.meshData);
renderer.bindFBO(fbo2);
renderer.uniforms.tMap = fbo1.texture;
renderer.uniforms.axis = 0;
renderer.render();

// 第三次，对y轴高斯模糊
renderer.useProgram(blurProgram);
renderer.bindFBO(fbo1);
renderer.uniforms.tMap = fbo2.texture;
renderer.uniforms.axis = 1;
renderer.render();

// 第四次，对x轴高斯模糊
renderer.useProgram(blurProgram);
renderer.bindFBO(fbo2);
renderer.uniforms.tMap = fbo1.texture;
renderer.uniforms.axis = 0;
renderer.render();

// 第五次，对y轴高斯模糊
renderer.useProgram(blurProgram);
renderer.bindFBO(null);
renderer.uniforms.tMap = fbo2.texture;
renderer.uniforms.axis = 1;
renderer.render();

```

```
uniform float filter;
      
void main() {
  vec4 color = texture2D(tMap, vUv);
  float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
  brightness = step(filter, brightness);

  // 高斯矩阵的权重值
  float weight[5];
  weight[0] = 0.227027;
  weight[1] = 0.1945946;
  weight[2] = 0.1216216;
  weight[3] = 0.054054;
  weight[4] = 0.016216;

  // 每一个相邻像素的坐标间隔，这里的512可以用实际的Canvas像素宽代替
  float tex_offset = 1.0 / 512.0;

  vec3 result = color.rgb;
  result *= weight[0];
  for(int i = 1; i < 5; ++i) {
    float f = float(i);
    if(axis == 0) { // x轴的高斯模糊
      result += texture2D(tMap, vUv + vec2(tex_offset * f, 0.0)).rgb * weight[i];
      result += texture2D(tMap, vUv - vec2(tex_offset * f, 0.0)).rgb * weight[i];
    } else { // y轴的高斯模糊
      result += texture2D(tMap, vUv + vec2(0.0, tex_offset * f)).rgb * weight[i];
      result += texture2D(tMap, vUv - vec2(0.0, tex_offset * f)).rgb * weight[i];
    }
  }

  gl_FragColor.rgb = brightness * result.rgb;
  gl_FragColor.a = color.a;
}


```

```
#ifdef GL_ES
  precision highp float;
#endif

uniform sampler2D tMap;
uniform sampler2D tSource;

varying vec2 vUv;

void main() {
  vec3 color = texture2D(tSource, vUv).rgb;
  vec3 bloomColor = texture2D(tMap, vUv).rgb;
  color += bloomColor;
  // tone mapping
  float exposure = 2.0;
  float gamma = 1.3;
  vec3 result = vec3(1.0) - exp(-color * exposure);
  // also gamma correct while we're at it
  if(length(bloomColor) > 0.0) {
    result = pow(result, vec3(1.0 / gamma));
  }
  gl_FragColor.rgb = result;
  gl_FragColor.a = 1.0;
}

```

```

// 创建三个FBO对象，fbo1和fbo2交替使用
const fbo0 = renderer.createFBO();
const fbo1 = renderer.createFBO();
const fbo2 = renderer.createFBO();

// 第一次，渲染原始图形
renderer.bindFBO(fbo0);
renderer.render();

// 第二次，对x轴高斯模糊
renderer.useProgram(blurProgram);
renderer.setMeshData(program.meshData);
renderer.bindFBO(fbo2);
renderer.uniforms.tMap = fbo0.texture;
renderer.uniforms.axis = 0;
renderer.uniforms.filter = 0.7;
renderer.render();

// 第三次，对y轴高斯模糊
renderer.useProgram(blurProgram);
renderer.bindFBO(fbo1);
renderer.uniforms.tMap = fbo2.texture;
renderer.uniforms.axis = 1;
renderer.uniforms.filter = 0;
renderer.render();

// 第四次，对x轴高斯模糊
renderer.useProgram(blurProgram);
renderer.bindFBO(fbo2);
renderer.uniforms.tMap = .texture;
renderer.uniforms.axis = 0;
renderer.uniforms.filter = 0;
renderer.render();

// 第五次，对y轴高斯模糊
renderer.useProgram(blurProgram);
renderer.bindFBO(fbo1);
renderer.uniforms.tMap = fbo2.texture;
renderer.uniforms.axis = 1;
renderer.uniforms.filter = 0;
renderer.render();

// 第六次，叠加辉光
renderer.useProgram(bloomProgram);
renderer.setMeshData(program.meshData);
renderer.bindFBO(null);
renderer.uniforms.tSource = fbo0.texture;
renderer.uniforms.tMap = fbo1.texture;
renderer.uniforms.axis = 1;
renderer.uniforms.filter = 0;
renderer.render();

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

void main() {
  vec2 st = vUv - vec2(0.5);
  float d = length(st);
  gl_FragColor.rgb = vec3(1.0 - smoothstep(0.05, 0.055, d));
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

void main() {
  vec3 smoke = vec3(0);
  if(uTime <= 0.0) {
    vec2 st = vUv - vec2(0.5);
    float d = length(st);
    smoke = vec3(1.0 - smoothstep(0.05, 0.055, d));
  }
  vec3 diffuse = texture2D(tMap, vUv).rgb;
  gl_FragColor.rgb = diffuse + smoke;
  gl_FragColor.a = 1.0;
}

```

```
const fbo = {
  readFBO: renderer.createFBO(),
  writeFBO: renderer.createFBO(),
  get texture() {
    return this.readFBO.texture;
  },
  swap() {
    const tmp = this.writeFBO;
    this.writeFBO = this.readFBO;
    this.readFBO = tmp;
  },
};

function update(t) {
  // 输出到画布
  renderer.bindFBO(null);
  renderer.uniforms.uTime = t / 1000;
  renderer.uniforms.tMap = fbo.texture;
  renderer.render();
  // 同时输出到FBO
  renderer.bindFBO(fbo.writeFBO);
  renderer.uniforms.tMap = fbo.texture;
  // 交换读写缓冲以便下一次写入
  fbo.swap();
  renderer.render();
  requestAnimationFrame(update);
}
update(0);

```


```
void main() {
  vec3 smoke = vec3(0);
  if(uTime <= 0.0) {
    vec2 st = vUv - vec2(0.5);
    float d = length(st);
    smoke = vec3(1.0 - smoothstep(0.05, 0.055, d));
  }
  vec2 st = vUv;
  st.y -= 0.001;
  vec3 diffuse = texture2D(tMap, st).rgb;
  gl_FragColor.rgb = diffuse + smoke;
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

void main() {
  vec3 smoke = vec3(0);
  if(uTime <= 0.0) {
    vec2 st = vUv - vec2(0.5);
    float d = length(st);
    smoke = vec3(step(d, 0.05));
    // smoke = vec3(1.0 - smoothstep(0.05, 0.055, d));
  }

  vec2 st = vUv;

  float offset = 1.0 / 256.0;
  vec3 diffuse = texture2D(tMap, st).rgb;

  vec4 left = texture2D(tMap, st + vec2(-offset, 0.0));
  vec4 right = texture2D(tMap, st + vec2(offset, 0.0));
  vec4 up = texture2D(tMap, st + vec2(0.0, -offset));
  vec4 down = texture2D(tMap, st + vec2(0.0, offset));

  float diff = 8.0 * 0.016 * (
    left.r + 
    right.r + 
    down.r + 
    2.0 * up.r - 
    5.0 * diffuse.r
  );

  gl_FragColor.rgb = (diffuse + diff) + smoke;
  gl_FragColor.a = 1.0;
}



```

```
void main() {
  vec3 smoke = vec3(0);
  if(uTime <= 0.0) {
    vec2 st = vUv - vec2(0.5);
    float d = length(st);
    smoke = vec3(step(d, 0.05));
    // smoke = vec3(1.0 - smoothstep(0.05, 0.055, d));
  }

  vec2 st = vUv;

  float offset = 1.0 / 256.0;
  vec3 diffuse = texture2D(tMap, st).rgb;

  vec4 left = texture2D(tMap, st + vec2(-offset, 0.0));
  vec4 right = texture2D(tMap, st + vec2(offset, 0.0));
  vec4 up = texture2D(tMap, st + vec2(0.0, -offset));
  vec4 down = texture2D(tMap, st + vec2(0.0, offset));

  float rand = noise(st + 5.0 * uTime);
  float diff = 8.0 * 0.016 * (
    (1.0 + rand) * left.r + 
    (1.0 - rand) * right.r + 
    down.r + 
    2.0 * up.r - 
    5.0 * diffuse.r
  );

  gl_FragColor.rgb = (diffuse + diff) + smoke;
  gl_FragColor.a = 1.0;
}

```