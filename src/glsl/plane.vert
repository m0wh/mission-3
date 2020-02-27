#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

uniform float uTime;

void main() {
  float z = 0.0
    + snoise3(vec3(position.xy / 10.0, uTime * 0.3))
    + snoise3(vec3(position.xy / 2.0, uTime * 0.3)) / 5.0
  ;

  vec4 modelViewPosition = modelViewMatrix * vec4(position.xy, z, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
