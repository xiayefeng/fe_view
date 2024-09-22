
```
// 求光源与点坐标的方向向量
vec3 dir = (viewMatrix * vec4(pointLightPosition, 1.0)).xyz - vPos;

// 归一化
dir = normalize(dir);

// 求反射向量
vec3 reflectionLight = reflect(-dir, vNormal);

```

```
vec3 eyeDirection = vCameraPos - vPos;
eyeDirection = normalize(eyeDirection);
// 与视线夹角余弦
float eyeCos = max(dot(eyeDirection, reflectionLight), 0.0);

float specular = 2.0 *  pow(eyeCos, 50.0);

// 合成颜色
gl_FragColor.rgb = specular + (ambientLight + diffuse) * materialReflection;
gl_FragColor.a = 1.0;

```

class Phong {
  constructor(ambientLight = [0.5, 0.5, 0.5]) {
    this.ambientLight = ambientLight;
    this.directionalLights = new Set();
    this.pointLights = new Set();
    this.spotLights = new Set();
  }

  addLight(light) {
    const {position, direction, color, decay, angle} = light;
    if(!position && !direction) throw new TypeError('invalid light');
    light.color = color || [1, 1, 1];
    if(!position) this.directionalLights.add(light);
    else {
      light.decay = decay || [0, 0, 1];
      if(!angle) {
        this.pointLights.add(light);
      } else {
        this.spotLights.add(light);
      }
    }
  }

  removeLight(light) {
    if(this.directionalLights.has(light)) this.directionalLights.delete(light);
    else if(this.pointLights.has(light)) this.pointLights.delete(light);
    else if(this.spotLights.has(light)) this.spotLights.delete(light);
  }

  get uniforms() {
    const MAX_LIGHT_COUNT = 16; // 最多每种光源设置16个
    this._lightData = this._lightData || {};
    const lightData = this._lightData;

    lightData.directionalLightDirection = lightData.directionalLightDirection || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};
    lightData.directionalLightColor = lightData.directionalLightColor || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};

    lightData.pointLightPosition = lightData.pointLightPosition || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};
    lightData.pointLightColor = lightData.pointLightColor || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};
    lightData.pointLightDecay = lightData.pointLightDecay || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};

    lightData.spotLightDirection = lightData.spotLightDirection || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};
    lightData.spotLightPosition = lightData.spotLightPosition || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};
    lightData.spotLightColor = lightData.spotLightColor || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};
    lightData.spotLightDecay = lightData.spotLightDecay || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};
    lightData.spotLightAngle = lightData.spotLightAngle || {value: new Float32Array(MAX_LIGHT_COUNT)};

    [...this.directionalLights].forEach((light, idx) => {
      lightData.directionalLightDirection.value.set(light.direction, idx * 3);
      lightData.directionalLightColor.value.set(light.color, idx * 3);
    });

    [...this.pointLights].forEach((light, idx) => {
      lightData.pointLightPosition.value.set(light.position, idx * 3);
      lightData.pointLightColor.value.set(light.color, idx * 3);
      lightData.pointLightDecay.value.set(light.decay, idx * 3);
    });

    [...this.spotLights].forEach((light, idx) => {
      lightData.spotLightPosition.value.set(light.position, idx * 3);
      lightData.spotLightColor.value.set(light.color, idx * 3);
      lightData.spotLightDecay.value.set(light.decay, idx * 3);
      lightData.spotLightDirection.value.set(light.direction, idx * 3);
      lightData.spotLightAngle.value[idx] = light.angle;
    });

    return {
      ambientLight: {value: this.ambientLight},
      ...lightData,
    };
  }
}

const phong = new Phong();
// 添加一个平行光
phong.addLight({
  direction: [-1, 0, 0],
});
// 添加两个点光源
phong.addLight({
  position: [-3, 3, 0],
  color: [1, 0, 0],
});

phong.addLight({
  position: [3, 3, 0],
  color: [0, 0, 1],
});

class Material {
  constructor(reflection, specularFactor = 0, shininess = 50) {
    this.reflection = reflection;
    this.specularFactor = specularFactor;
    this.shininess = shininess;
  }

  get uniforms() {
    return {
      materialReflection: {value: this.reflection},
      specularFactor: {value: this.specularFactor},
      shininess: {value: this.shininess},
    };
  }
}

const matrial1 = new Material(new Color('#0000ff'), 2.0);
const matrial2 = new Material(new Color('#ff00ff'), 2.0);
const matrial3 = new Material(new Color('#008000'), 2.0);
const matrial4 = new Material(new Color('#ff0000'), 2.0);


const program1 = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
    ...matrial1.uniforms,
    ...phong.uniforms,
  },
});
const program2 = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
    ...matrial2.uniforms,
    ...phong.uniforms,
  },
});
const program3 = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
    ...matrial3.uniforms,
    ...phong.uniforms,
  },
});
const program4 = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
    ...matrial4.uniforms,
    ...phong.uniforms,
  },
});


```
#define MAX_LIGHT_COUNT 16
uniform mat4 viewMatrix;

uniform vec3 ambientLight;
uniform vec3 directionalLightDirection[MAX_LIGHT_COUNT];
uniform vec3 directionalLightColor[MAX_LIGHT_COUNT];
uniform vec3 pointLightColor[MAX_LIGHT_COUNT];
uniform vec3 pointLightPosition[MAX_LIGHT_COUNT];
uniform vec3 pointLightDecay[MAX_LIGHT_COUNT];
uniform vec3 spotLightColor[MAX_LIGHT_COUNT];
uniform vec3 spotLightDirection[MAX_LIGHT_COUNT];
uniform vec3 spotLightPosition[MAX_LIGHT_COUNT];
uniform vec3 spotLightDecay[MAX_LIGHT_COUNT];
uniform float spotLightAngle[MAX_LIGHT_COUNT];

uniform vec3 materialReflection;
uniform float shininess;
uniform float specularFactor;

float getSpecular(vec3 dir, vec3 normal, vec3 eye) {
  vec3 reflectionLight = reflect(-dir, normal);
  float eyeCos = max(dot(eye, reflectionLight), 0.0);
  return specularFactor *  pow(eyeCos, shininess);
}
      
vec4 phongReflection(vec3 pos, vec3 normal, vec3 eye) {
  float specular = 0.0;
  vec3 diffuse = vec3(0);
  
  // 处理平行光
  for(int i = 0; i < MAX_LIGHT_COUNT; i++) {
    vec3 dir = directionalLightDirection[i];
    if(dir.x == 0.0 && dir.y == 0.0 && dir.z == 0.0) continue;
    vec4 d = viewMatrix * vec4(dir, 0.0);
    dir = normalize(-d.xyz);
    float cos = max(dot(dir, normal), 0.0);
    diffuse += cos * directionalLightColor[i];
    specular += getSpecular(dir, normal, eye);
  }

  // 处理点光源
  for(int i = 0; i < MAX_LIGHT_COUNT; i++) {
    vec3 decay = pointLightDecay[i];
    if(decay.x == 0.0 && decay.y == 0.0 && decay.z == 0.0) continue;
    vec3 dir = (viewMatrix * vec4(pointLightPosition[i], 1.0)).xyz - pos;
    float dis = length(dir);
    dir = normalize(dir);
    float cos = max(dot(dir, normal), 0.0);
    float d = min(1.0, 1.0 / (decay.x * pow(dis, 2.0) + decay.y * dis + decay.z));
    diffuse += d * cos * pointLightColor[i];
    specular += getSpecular(dir, normal, eye);
  }

  // 处理聚光灯
  for(int i = 0; i < MAX_LIGHT_COUNT; i++) {
    vec3 decay = spotLightDecay[i];
    if(decay.x == 0.0 && decay.y == 0.0 && decay.z == 0.0) continue;

    vec3 dir = (viewMatrix * vec4(spotLightPosition[i], 1.0)).xyz - pos;
    float dis = length(dir);
    dir = normalize(dir);

    // 聚光灯的朝向
    vec3 spotDir = (viewMatrix * vec4(spotLightDirection[i], 0.0)).xyz;
    // 通过余弦值判断夹角范围
    float ang = cos(spotLightAngle[i]);
    float r = step(ang, dot(dir, normalize(-spotDir)));

    float cos = max(dot(dir, normal), 0.0);
    float d = min(1.0, 1.0 / (decay.x * pow(dis, 2.0) + decay.y * dis + decay.z));
    diffuse += r * d * cos * spotLightColor[i];
    specular += r * getSpecular(dir, normal, eye);
  }

  return vec4(diffuse, specular);
}


void main() {
  vec3 eyeDirection = normalize(vCameraPos - vPos);
  vec4 phong = phongReflection(vPos, vNormal, eyeDirection);

  // 合成颜色
  gl_FragColor.rgb = phong.w + (phong.xyz + ambientLight) * materialReflection;
  gl_FragColor.a = 1.0;
}

```

