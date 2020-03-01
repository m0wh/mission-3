#pragma glslify: elev = require(./calculateElevation.glsl)

uniform float uTime;
varying vec3 vNormal;
varying vec3 vLightFront;
varying vec3 vIndirectFront;
varying float fogDepth;

float tangentFactor = 0.1;

vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}

void main () {
  vec3 pos = position + vec3(0.0, uTime * 3.0, 0.0);
  vec3 distortedPosition = elev(pos);

  vec3 tangent1 = orthogonal(normal);
  vec3 tangent2 = normalize(cross(normal, tangent1));
  vec3 nearby1 = pos + tangent1 * tangentFactor;
  vec3 nearby2 = pos + tangent2 * tangentFactor;
  vec3 distorted1 = elev(nearby1);
  vec3 distorted2 = elev(nearby2);

  vec4 modelViewPosition = modelViewMatrix * vec4(position.xy, distortedPosition.z, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;

  vNormal = normalize(cross(distorted1 - distortedPosition, distorted2 - distortedPosition));
}
