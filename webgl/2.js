import {loadImage, getImageData, traverse} from '../lib/util.js';
const canvas = document.getElementById('paper');
const context = canvas.getContext('2d');
(async function () {
  const img = await loadImage('assets/girl1.jpg');
  const imageData = getImageData(img);
  traverse(imageData, ({r, g, b, a, x, y}) => {
    const d = Math.hypot((x - 0.5), (y - 0.5));
    a *= 1.0 - 2 * d;
    return [r, g, b, a];
  });
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  context.putImageData(imageData, 0, 0);
}());

```
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D tMap;
uniform float uTime;
varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec2 st = vUv * vec2(100, 55.4);
    vec2 uv = vUv + 1.0 - 2.0 * random(floor(st));
    vec4 color = texture2D(tMap, mix(uv, vUv, min(uTime, 1.0)));
    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = color.a * uTime;
}

```