// 直角坐标影射为极坐标
function toPolar(x, y) {
  const r = Math.hypot(x, y);
  const θ= Math.atan2(y, x);
  return [r, θ];
}

// 极坐标映射为直角坐标
function fromPolar(r, θ) {
  const x = r * cos(θ);
  const y = r * sin(θ);
  return [x, y];
}

export function parametric(sFunc, tFunc, rFunc) {
  return function (start, end, seg = 100, ...args) {
    const points = [];
    for(let i = 0; i <= seg; i++) {
      const p = i / seg;
      const t = start * (1 - p) + end * p;
      const x = sFunc(t, ...args);
      const y = tFunc(t, ...args);
      if(rFunc) {
        points.push(rFunc(x, y));
      } else {
        points.push([x, y]);
      }
    }
    return {
      draw: draw.bind(null, points),
      points,
    };
  };
}

const fromPolar = (r, θ) => {
  return [r * Math.cos(θ), r * Math.sin(θ)];
};

const arc = parametric(
  t => 200,
  t => t,
  fromPolar,
);

arc(0, Math.PI).draw(ctx);

const rose = parametric(
  (t, a, k) => a * Math.cos(k * t),
  t => t,
  fromPolar,
);

rose(0, Math.PI, 100, 200, 5).draw(ctx, {strokeStyle: 'blue'});

const heart = parametric(
  (t, a) => a - a * Math.sin(t),
  t => t,
  fromPolar,
);

heart(0, 2 * Math.PI, 100, 100).draw(ctx, {strokeStyle: 'red'});

const foliumRight = parametric(
  (t, a) => Math.sqrt(2 * a ** 2 * Math.cos(2 * t)),
  t => t,
  fromPolar,
);

const foliumLeft = parametric(
  (t, a) => -Math.sqrt(2 * a ** 2 * Math.cos(2 * t)),
  t => t,
  fromPolar,
);

foliumRight(-Math.PI / 4, Math.PI / 4, 100, 100).draw(ctx, {strokeStyle: 'green'});
foliumLeft(-Math.PI / 4, Math.PI / 4, 100, 100).draw(ctx, {strokeStyle: 'green'});


```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

vec2 polar(vec2 st) {
  return vec2(length(st), atan(st.y, st.x));
}

void main() {
  vec2 st = vUv - vec2(0.5);
  st = polar(st);
  gl_FragColor.rgb = smoothstep(st.x, st.x + 0.01, 0.2) * vec3(1.0);
  gl_FragColor.a = 1.0;
}

```

```
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform vec2 uMouse;

vec3 hsv2rgb(vec3 c){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

vec2 polar(vec2 st) {
  return vec2(length(st), atan(st.y, st.x));
}

void main() {
  vec2 st = vUv - vec2(0.5);
  st = polar(st);
  float d = smoothstep(st.x, st.x + 0.01, 0.2);
  if(st.y < 0.0) st.y += 6.28;
  float p = st.y / 6.28;
  gl_FragColor.rgb = d * hsv2rgb(vec3(p, uMouse.x, uMouse.y));
  gl_FragColor.a = 1.0;
}

```