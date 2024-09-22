```
precision highp float;

uniform vec3 ambientLight;
uniform vec3 materialReflection;

void main() {
  gl_FragColor.rgb = ambientLight * materialReflection;
  gl_FragColor.a = 1.0;
}

```

```
 precision highp float;

  attribute vec3 position;
  attribute vec3 normal;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat3 normalMatrix;
  uniform vec3 directionalLight;
  
  varying vec3 vNormal;
  varying vec3 vDir;

  void main() {
    // 计算光线方向
    vec4 invDirectional = viewMatrix * vec4(directionalLight, 0.0);
    vDir = -invDirectional.xyz;
    
    // 计算法向量
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }

```


```
precision highp float;

uniform vec3 ambientLight;
uniform vec3 materialReflection;
uniform vec3 directionalLightColor;

varying vec3 vNormal;
varying vec3 vDir;

void main() {
  // 求光线与法线夹角的余弦
  float cos = max(dot(normalize(vDir), vNormal), 0.0);
  
  // 计算漫反射
  vec3 diffuse = cos * directionalLightColor;
  
  // 合成颜色
  gl_FragColor.rgb = (ambientLight + diffuse) * materialReflection;
  gl_FragColor.a = 1.0;
}

```

const ambientLight = {value: [0.5, 0.5, 0.5]};

const directional = {
  directionalLight: {value: [1, 0, 0]},
  directionalLightColor: {value: [1, 1, 1]},
};

const program1 = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
    ambientLight,
    materialReflection: {value: [0, 0, 1]},
    ...directional,
  },
});


```
precision highp float;

attribute vec3 position;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;
varying vec3 vPos;

void main() {
  vPos = modelViewMatrix * vec4(position, 1.0);;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * vPos;
}


```

```
precision highp float;

uniform vec3 ambientLight;
uniform vec3 materialReflection;
uniform vec3 pointLightColor;
uniform vec3 pointLightPosition;
uniform mat4 viewMatrix;

varying vec3 vNormal;
varying vec3 vPos;

void main() {
  // 光线到点坐标的方向
  vec3 dir = (viewMatrix * vec4(pointLightPosition, 1.0)).xyz - vPos;
  
  // 与法线夹角余弦
  float cos = max(dot(normalize(dir), vNormal), 0.0);
  
  // 计算漫反射
  vec3 diffuse = cos * pointLightColor;
  
  // 合成颜色
  gl_FragColor.rgb = (ambientLight + diffuse) * materialReflection;
  gl_FragColor.a = 1.0;
}



```

```
precision highp float;

uniform vec3 ambientLight;
uniform vec3 materialReflection;
uniform vec3 pointLightColor;
uniform vec3 pointLightPosition;
uniform mat4 viewMatrix;
uniform vec3 pointLightDecayFactor;

varying vec3 vNormal;
varying vec3 vPos;

void main() {
  // 光线到点坐标的方向
  vec3 dir = (viewMatrix * vec4(pointLightPosition, 1.0)).xyz - vPos;
  
  // 光线到点坐标的距离，用来计算衰减
  float dis = length(dir);

  // 与法线夹角余弦
  float cos = max(dot(normalize(dir), vNormal), 0.0);

  // 计算衰减
  float decay = min(1.0, 1.0 /
    (pointLightDecayFactor.x * pow(dis, 2.0) + pointLightDecayFactor.y * dis + pointLightDecayFactor.z));
  
  // 计算漫反射
  vec3 diffuse = decay * cos * pointLightColor;
  
  // 合成颜色
  gl_FragColor.rgb = (ambientLight + diffuse) * materialReflection;
  gl_FragColor.a = 1.0;
}


```


```
precision highp float;

uniform mat4 viewMatrix;
uniform vec3 ambientLight;
uniform vec3 materialReflection;
uniform vec3 spotLightColor;
uniform vec3 spotLightPosition;
uniform vec3 spotLightDecayFactor;
uniform vec3 spotLightDirection;
uniform float spotLightAngle;

varying vec3 vNormal;
varying vec3 vPos;

void main() {
  // 光线到点坐标的方向
  vec3 invLight = (viewMatrix * vec4(spotLightPosition, 1.0)).xyz - vPos;
  vec3 invNormal = normalize(invLight);

  // 光线到点坐标的距离，用来计算衰减
  float dis = length(invLight);  
  // 聚光灯的朝向
  vec3 dir = (viewMatrix * vec4(spotLightDirection, 0.0)).xyz;

  // 通过余弦值判断夹角范围
  float ang = cos(spotLightAngle);
  float r = step(ang, dot(invNormal, normalize(-dir)));

  // 与法线夹角余弦
  float cos = max(dot(invNormal, vNormal), 0.0);
  // 计算衰减
  float decay = min(1.0, 1.0 /
    (spotLightDecayFactor.x * pow(dis, 2.0) + spotLightDecayFactor.y * dis + spotLightDecayFactor.z));
  
  // 计算漫反射
  vec3 diffuse = r * decay * cos * spotLightColor;
  
  // 合成颜色
  gl_FragColor.rgb = (ambientLight + diffuse) * materialReflection;
  gl_FragColor.a = 1.0;
}

```

const directional2 = {
  spotLightPosition: {value: [3, 3, 0]},
  spotLightColor: {value: [1, 1, 1]},
  spotLightDecayFactor: {value: [0.05, 0, 1]},
  spotLightDirection: {value: [-1, -1, 0]},
  spotLightAngle: {value: Math.PI / 12},
};
